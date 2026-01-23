/* eslint-disable @typescript-eslint/naming-convention */
import { HostListener, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { DBService } from '../database/db.service';
import { CompaniesDataService } from 'src/app/companies/data/companies-data.service';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import {
  CreateCompanyResp,
  CreateContractClauseResp,
  CreateContractResp,
  CreateSurveyResp,
  CreateVesselResp,
  GetClausesResponse,
  GetCompaniesResponse,
  GetContractsResponse,
  GetVesselsResponse,
  GetProfileResponse,
  CreateProfileResponse,
  GetBankAccountsResponse,
  GetBeneficiaryResponse,
  CreateBankAccountResponse,
  CreateBeneficiaryResponse,
  GetUsersResponse,
} from './types';
import { VesselsDataService } from 'src/app/vessels/data/vessels-data.service';
import { ContractDataService } from 'src/app/contracts/data/contract-data.service';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';
import { SurveyDataService } from 'src/app/survey/data/survey-data.service';
import { forkJoin, lastValueFrom } from 'rxjs';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';
import { AuthService } from '../auth/auth.service';
import { PaymentsDataService } from 'src/app/payments/data/payments-data.service';
import { StorageKeys, UserData, UserRole } from '../../types/api-types';
import { UploadService } from '../upload/upload.service';
import { DocumentsDataService } from 'src/app/mydocuments/data/documents-data.service';
import { WagesDataService } from 'src/app/wages/data/wages-data.service';
import { NotificationsDataService } from 'src/app/notifications/data/notifications-data.service';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  db: SQLiteObject;
  isDbInitialized = false;

  constructor(
    private platform: Platform,
    public sqlite: SQLite,
    private apiService: ApiService,
    private companyServ: CompaniesDataService,
    private vesselServ: VesselsDataService,
    private contractServ: ContractDataService,
    private dbService: DBService,
    private sharedMethods: SharedmethodsService,
    private surveyDataService: SurveyDataService,
    private profilesDataService: ProfilesDataService,
    private authService: AuthService,
    private paymentsDataService: PaymentsDataService,
    private uploadService: UploadService,
    private documentsDataService: DocumentsDataService,
    private wagesDataService: WagesDataService,
    private notificationsDataService: NotificationsDataService,
  ) {
    this.platform.ready().then(async() => {
      this.db = await this.dbService.configureDB();
    });

    this.dbService.isDBsetup().subscribe((res) => {
      if (res) {
        this.isDbInitialized = res;
      }
    });
  }

  updateEntityOnlineId(onlineId: string, appRef: string, table: string) {
    const params = [onlineId, appRef];
    const query = `UPDATE ${table} SET online_ref = ? WHERE app_ref = ?`;
    this.db.executeSql(query, params).then(() => {
    }).catch((error) => {
      console.log(error);
    });
  }

  async syncData() {
    const isValid = await this.authService.checkAcessTokenValidity();
    if (!isValid || !this.isDbInitialized) {
    // if (!isValid || !this.isDbInitialized || !navigator.onLine) {
      return;
    }

    await this.apiService.setApiRequestHeaders();
    await this.syncUsersData();
    await this.syncCompanies();
    await this.syncVessels();
    await this.syncContracts();
    await this.syncSurveyResponses();
    await this.syncInlineQuestions();
    await this.syncMyDocuments();
    await this.syncPassports();
    await this.syncLearningHubProgress();
    await this.syncWages();
    await this.syncNotifications();
    await this.fetchCompanies();
    await this.fetchVessels();
    await this.fetchContracts(); // clauses are fetched after contracts have been fetched in the fetchContracts method
    await this.fetchMyDocuments();
    await this.fetchPassports();
    await this.fetchInlineQuestions();
    await this.fetchLearningHubProgress();
    await this.fetchWages();
    await this.fetchNotifications();
  }

  @HostListener('window:online', ['$event'])
  onOnline() {
    this.syncData();
  }


  async syncCompanies() {
    const isValid = await this.authService.checkAcessTokenValidity();
    if (!isValid || !this.isDbInitialized || !navigator.onLine) {
      return;
    }

    const companies = this.companyServ.companies;
    if (companies.length > 0) {
      const user = await this.sharedMethods.getUserData();
      for (const company of companies) {
        if (user?.id !== company?.createdBy) { continue; }

        const companyToUpload = Object.assign({}, company);
        delete companyToUpload.id;
        if (!companyToUpload.onlineRef) {
          this.apiService.post('companies', companyToUpload).subscribe(async(response: CreateCompanyResp) => {
            if (response?.status === 'OK') {
              await this.updateEntityOnlineId(response?.data?.id, companyToUpload.appRef, 'companies');
            }
          });
        } else {
          this.apiService.put('companies', companyToUpload.onlineRef, companyToUpload).subscribe((response: any) => {
            if (response?.status !== 'OK') {
              console.error(`Failed to sync company ${company.name} to the api`, response);
            }
          });
        }
      }
    }
  }

  async fetchCompanies() {
    return await lastValueFrom(this.apiService.get('companies')).then(async(response: GetCompaniesResponse) => {
      if (response.status === 200 && response.body.data.length > 0) {
        for (const company of response.body.data) {
          const companyExists = await this.dbService.checkIfEntryExists('companies', company.appRef);
          if (!companyExists) {
            await this.companyServ.saveOnlineCompany(company)
              .then((id) => { console.log(`Company ${company.name} saved with id ${id}`);});
          } else {
            const currentCompany = await this.companyServ.companies.find(c => c.appRef === company.appRef);
            const currentUpdateDate = new Date(currentCompany?.updatedAt);
            const newUpdateDate = new Date(company.updatedAt);
            if (currentUpdateDate < newUpdateDate) {
              const companyToUpdate = {};
              for (const key of Object.keys(company)) {
                const snakeCaseKey = this.sharedMethods.convertCamelToSnakeCase(key);
                companyToUpdate[snakeCaseKey] = company[key];
              }
              await this.companyServ.update(companyToUpdate, currentCompany.id).then(() => {
                console.log(`Company ${company.name} updated successfully.`);
              });
            }
          }
        }
      }
    });
  }

  async syncVessels() {
    const isValid = await this.authService.checkAcessTokenValidity();
    if (!isValid || !this.isDbInitialized || !navigator.onLine) {
      return;
    }

    const vessels = this.vesselServ.vessels;
    if (vessels.length > 0) {
      const user = await this.sharedMethods.getUserData();
      for (const vessel of vessels) {
        if (user?.id !== vessel?.createdBy) { continue; }

        const vesselToUpload = Object.assign({}, vessel);
        delete vesselToUpload.id;
        if (!vesselToUpload.onlineRef) {
          this.apiService.post('vessels', vesselToUpload).subscribe(async(response: CreateVesselResp) => {
            if (response?.status === 'OK') {
              await this.dbService.updateDatabaseField('vessels', 'online_ref', response?.data?.id, vesselToUpload.appRef);
              await this.postVesselImage(vessel, response?.data?.id);
            }
          });
        } else {
          this.apiService.put('vessels', vesselToUpload.onlineRef, vesselToUpload).subscribe(async(response: any) => {
            if (response?.status === 'OK') {
              await this.postVesselImage(vessel, vesselToUpload.onlineRef);
            }
          });
        }
      }
    }
  }

  async postVesselImage(vessel, vesselOnlineRef) {
    if (vessel?.imageFile?.webPath) {
      const imageFile = await this.uploadService.retrieveAndReturnBlob(vessel.imageFile.webPath);
      if (imageFile) {
        const vesselImage = await this.vesselServ.getVesselImageByVesselId(vessel.id);
        const imageData = new FormData();
        imageData.append('fileContent', imageFile);
        imageData.append('entityType', 'vessel_image');
        imageData.append('vesselId', vesselOnlineRef);
        imageData.append('appRef', vesselImage.app_ref || this.sharedMethods.generateAppRef());
        imageData.append('description', vesselImage.description);
        imageData.append('createdAt', vesselImage.createdAt);
        imageData.append('updatedAt', vesselImage.updatedAt);
        imageData.append('createdBy', vesselImage.createdBy);
        imageData.append('updatedBy', vesselImage.updatedBy);
        this.apiService.post('file-upload', imageData).subscribe((res: any) => {
          if (res?.status === 'OK') {
            if (!vesselImage.onlineRef) {
              this.dbService.updateDatabaseField('vessel_images', 'online_ref', res?.data.vesselImage?.id, vesselImage.app_ref);
            }
          } else {
            console.error(`Failed to sync vessel image for vessel ${vessel.name} to the api`, res);
          }
        });
      }
    }
  }

  // TODO: to test, images
  async fetchVessels() {
    return await lastValueFrom(this.apiService.get('vessels')).then(async(response: GetVesselsResponse) => {
      if (response.status === 200 && response.body.data.length > 0) {
        for (const vessel of response.body.data) {
          const vesselExists = await this.dbService.checkIfEntryExists('vessels', vessel.appRef);
          if (!vesselExists) {
            await this.vesselServ.saveOnlineVessel(vessel).then(async(id) => {
              console.log ( `Vessel ${vessel.name} saved with id ${id}`);
              if (vessel?.vesselImage) {
                await this.saveOnlineVesselImage(vessel.vesselImage, id);
              }
            });
          } else {
            const currentVessel = await this.vesselServ.vessels.find(v => v.appRef === vessel.appRef);
            const currentUpdateDate = new Date(currentVessel?.updatedAt);
            const newUpdateDate = new Date(vessel.updatedAt);
            if (currentUpdateDate < newUpdateDate) {
              const vesselToUpdate = {};
              for (const key of Object.keys(vessel)) {
                const snakeCaseKey = this.sharedMethods.convertCamelToSnakeCase(key);
                vesselToUpdate[snakeCaseKey] = vessel[key];
              }
              vesselToUpdate['id'] = currentVessel.id;
              await this.vesselServ.update(vesselToUpdate).then(() => {
                console.log(`Vessel ${vessel.name} updated successfully.`);
              });
            }
            await this.saveOnlineVesselImage(vessel.vesselImage, currentVessel.id);
          }
        }
      }
    });
  }

  async saveOnlineVesselImage(data, localVesselId) {
    const localVesselImage = await this.vesselServ.getVesselImageByVesselId(localVesselId);
    if (!localVesselImage) {
      await this.uploadService.fetchAndSaveFile(data?.imageUrl).then(async(fileUri) => {
        if (fileUri) {
          const user = await this.sharedMethods.getUserData();
          const now = this.sharedMethods.getCurrentDateTime();
          const saveObj = {
            vesselId: localVesselId,
            appRef: data?.appRef || this.sharedMethods.generateAppRef(),
            description: data?.description,
            imageUrl: fileUri,
            onlineRef: data?.id,
            createdAt: data?.createdAt ??  now,
            updatedAt: data?.updatedAt ??  now,
            createdBy: data?.createdBy ?? user?.id,
            updatedBy: data?.updatedBy ?? user?.id,
          };
          await this.vesselServ.saveOnlineVesselImage(saveObj).then(() => {});
        }
      });
    } else {
      const currentVesselImage = (await this.vesselServ.getVesselImages()).find(v => v.onlineRef === data.id);
      const currentUpdateDate = new Date(currentVesselImage?.updatedAt);
      const newUpdateDate = new Date(data.updatedAt);
      const currentImageName = currentVesselImage?.imageUrl ? currentVesselImage.imageUrl.split('files/')[1] : null;
      const isCurrentImageSameAsNew = currentImageName && data.imageUrl && data.imageUrl.includes(currentImageName);
      if (currentUpdateDate < newUpdateDate) {
        const imageUrl = isCurrentImageSameAsNew ? currentVesselImage.imageUrl : await this.uploadService.fetchAndSaveFile(data.imageUrl);
        const imageToUpdate = {
          id: currentVesselImage.id,
          description: data.description,
          image_url: imageUrl,
          updated_at: data.updatedAt,
          updated_by: data.updatedBy,
        };
        await this.vesselServ.updateVesselImage(imageToUpdate).then(() => {
          console.log(`Vessel image ${imageToUpdate.id} updated successfully.`);
        });
      }
    }
  }

  async syncContracts() {
    const isValid = await this.authService.checkAcessTokenValidity();
    if (!isValid || !this.isDbInitialized || !navigator.onLine) {
      return;
    }

    const contracts  = this.contractServ.contracts;
    if (contracts.length > 0) {
      const user = await this.sharedMethods.getUserData();
      for (const contract of contracts) {
        if (user?.id !== contract?.createdBy) { continue; }

        contract.startDate = new Date(contract.startDate).toISOString().split('T')[0];
        contract.endDate = new Date(contract.endDate).toISOString().split('T')[0];
        const tempContractId = contract.id;
        const contractToUpload = Object.assign({}, contract);
        delete contractToUpload.id;

        if (!contractToUpload.description) { delete contractToUpload.description; }
        if (!contractToUpload.taiwaneseCompany) {
          delete contractToUpload.taiwaneseCompany;
        } else {
          const taiwaneseCompanyId = Number(contractToUpload.taiwaneseCompany);
          const taiwanCompany = await this.companyServ.getCompanyById(taiwaneseCompanyId);
          if (taiwanCompany) {
            contractToUpload.taiwaneseCompany = taiwanCompany.onlineRef;
          } else {
            delete contractToUpload.taiwaneseCompany;
          }
        }
        if (!contractToUpload.indonesianCompany) {
          delete contractToUpload.indonesianCompany;
        } else {
          const indonesianCompanyId = Number(contractToUpload.indonesianCompany);
          const indonesianCompany = await this.companyServ.getCompanyById(indonesianCompanyId);
          if (indonesianCompany) {
            contractToUpload.indonesianCompany = indonesianCompany.onlineRef;
          } else {
            delete contractToUpload.indonesianCompany;
          }
        }

        if (!contract.onlineRef) {
          this.apiService.post('contracts', contractToUpload).subscribe(async(response: CreateContractResp) => {
            if (response?.status === 'OK') {

              contract.id = tempContractId;
              this.dbService.updateDatabaseField('contracts', 'online_ref', response?.data?.id, contract.appRef);
              await this.postContractDocument(contract);

              // start syncing the clauses at this point.
              // we'd avoid making a different db call to get th online_ref
              await this.syncContractClauses(tempContractId, response?.data?.id);
            }
          });
        } else {
          this.apiService.put('contracts', contractToUpload.onlineRef, contractToUpload).subscribe(async(response: any) => {
            if (response?.status === 'OK') {
              await this.postContractDocument(contract);
              await this.syncContractClauses(contract.id, contract.onlineRef);
            }
          });
        }
      }
    }
  }

  async postContractDocument(contract) {
    if (contract?.file?.fileUrl) {
      const docFile = await this.uploadService.retrieveAndReturnBlob(contract.file.fileUrl);
      if (docFile) {
        const contractDocument = await this.contractServ.getContractDocumentByField('contract_id', contract.id);
        const docData = new FormData();
        docData.append('fileContent', docFile);
        docData.append('entityType', 'contract');
        docData.append('contractId', contract.onlineRef);
        docData.append('name', contractDocument.name);
        docData.append('status', contractDocument.status);
        docData.append('createdAt', contractDocument.createdAt);
        docData.append('updatedAt', contractDocument.updatedAt);
        docData.append('createdBy', contractDocument.createdBy);
        docData.append('updatedBy', contractDocument.updatedBy);
        this.apiService.post('file-upload', docData).subscribe((res: any) => {
          if (res?.status === 'OK') {
            if (!contractDocument.onlineRef) {
              this.contractServ.updateContractDocumentFieldByContractId(
                contractDocument.contract_id,
                'online_ref',
                res?.data.contractDocument?.id
              );
            }
          } else {
            console.error(`Failed to sync contract document for contract ${contract.name} to the api`, res);
          }
        });
      }
    }
  }

  async fetchContracts() {
    return await lastValueFrom(this.apiService.get('contracts')).then(async(response: GetContractsResponse) => {
      if (response.status === 200 && response.body.data.length > 0) {
        const onlineContracts = response.body.data;
        // order by createdAt in descending order
        onlineContracts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const userOnlineContracts = onlineContracts.map((contract) => contract.appRef);
        await this.sharedMethods.saveDataToStorage(StorageKeys.currentUserOnlineContractsAppRefs, userOnlineContracts);

        forkJoin(response.body.data.map(async(contract) => {
          const contractToSave = { ...contract };
          delete contractToSave.id;
          if (contract?.taiwaneseCompany) {
            const taiwaneseCompany = await this.companyServ.getCompanyByField('onlineRef', contract.taiwaneseCompany);
            contractToSave.taiwaneseCompany = taiwaneseCompany?.id || null;
          }
          if (contract?.indonesianCompany) {
            const indonesianCompany = await this.companyServ.getCompanyByField('onlineRef', contract.indonesianCompany);
            contractToSave.indonesianCompany = indonesianCompany?.id || null;
          }
          const contractExists = await this.dbService.checkIfEntryExists('contracts', contract.appRef);
          if (!contractExists) {
            await this.contractServ.saveOnlineContract(contractToSave).then((id) => {
              console.log(`Contract ${contract.name} saved with id ${id}`);
            });
          } else {
            const currentContract = await this.contractServ.contracts.find(c => c.appRef === contract.appRef);
            const currentUpdateDate = new Date(currentContract?.updatedAt);
            const newUpdateDate = new Date(contract.updatedAt);
            if (currentUpdateDate < newUpdateDate) {
              const contractToUpdate = {};
              for (const key of Object.keys(contractToSave)) {
                const snakeCaseKey = this.sharedMethods.convertCamelToSnakeCase(key);
                contractToUpdate[snakeCaseKey] = contractToSave[key];
              }
              contractToUpdate['id'] = currentContract.id;
              await this.contractServ.update(contractToUpdate).then(() => {
                console.log(`Contract ${contract.name} updated successfully.`);
              });
            }
          }
        })).subscribe(async() => {
          // fetch the contract clauses & documents after the contracts have been fetched
          await this.fetchContractDocuments();
          await this.fetchContractClauses();
        });
      }
    });
  }

  async fetchContractDocuments() {
    return await lastValueFrom(this.apiService.get('contracts-documents')).then(async(response) => {
      if (response.status === 200 && response.body.length > 0) {
        for (const doc of response.body) {
          const contract = await this.contractServ.getContractByField('onlineRef', doc.contract);
          if (contract) {
            const contractDocument = await this.contractServ.getContractDocumentByField('contract_id', contract.id);
            if (!contractDocument) {
              await this.uploadService.fetchAndSaveFile(doc.url).then(async(fileUri) => {
                if (fileUri) {
                  const user = await this.sharedMethods.getUserData();
                  const now = this.sharedMethods.getCurrentDateTime();
                  const saveObj = {
                    contractId: contract.id,
                    name: doc.name,
                    url: fileUri,
                    status: doc.status,
                    onlineRef: doc.id,
                    createdAt: doc.createdAt ??  now,
                    updatedAt: doc.updatedAt ??  now,
                    createdBy: doc.createdBy ?? user?.id,
                    updatedBy: doc.updatedBy ?? user?.id,
                  };
                  await this.contractServ.saveOnlineContractDocument(saveObj).then(() => {});
                }
              });
            } else {
              const currentUpdateDate = new Date(contractDocument?.updatedAt);
              const newUpdateDate = new Date(doc.updatedAt);
              if (currentUpdateDate < newUpdateDate) {
                const currentDocName = contractDocument?.url ? contractDocument.url.split('files/')[1] : null;
                const isCurrentDocSameAsNew = currentDocName && doc.url && doc.url.includes(currentDocName);
                const url = isCurrentDocSameAsNew ? contractDocument.url : await this.uploadService.fetchAndSaveFile(doc.url);
                const updateObj = {
                  id: contractDocument.id,
                  name: doc.name,
                  url,
                  status: doc.status,
                  updatedAt: doc.updatedAt,
                  updatedBy: doc.updatedBy,
                };
                await this.contractServ.updateContractDocument(contractDocument.id, updateObj).then(() => {
                  console.log(`Contract document ${updateObj.name} updated successfully.`);
                });
              }
            }
          }
        }
      }
    });
  }

  async syncContractClauses(contractId, contractOnlineRef) {
    const isValid = await this.authService.checkAcessTokenValidity();
    if (!isValid || !this.isDbInitialized || !navigator.onLine) {
      return;
    }

    const clauses = await this.contractServ.retrieveContractClauses(contractId);
    for (const clause of clauses) {
      // The contract_id has to be the for the online record and not the local before sending to the api
      // replace the contract_id with the contract id online_ref
      clause.contract = contractOnlineRef;
      const clauseToUpload = Object.assign({}, clause);
      delete clauseToUpload.id;
      if (!clause.onlineRef) {
        await lastValueFrom(this.apiService.post('contracts-clauses', clauseToUpload)).then(async(response: CreateContractClauseResp) => {
          if (response?.status === 'OK') {
            this.dbService.updateDatabaseField('contract_clauses', 'online_ref', response?.data?.id, clause.appRef);
            await this.syncContractClausesAttachments(clause);
          }
        }).catch((e) => {
          console.error('error', e);
          // if (e?.error?.appRef && e.error.appRef[0] === 'contract clause with this app ref already exists.') {
          //   console.log('contract clause with this app ref already exists.');
          // }
        });
      } else {
        this.apiService.put('contracts-clauses', clause.onlineRef, clauseToUpload).subscribe(async(response: any) => {
          if (response?.status === 'OK') {
            await this.syncContractClausesAttachments(clause);
          } else {
            console.error('Failed to update contract clause', response);
          }
        });
      }
    }
  }

  async syncContractClausesAttachments(clause) {
    const isValid = await this.authService.checkAcessTokenValidity();
    if (!isValid || !this.isDbInitialized || !navigator.onLine) {
      return;
    }

    if (clause.kind === 'contract-clauses-attachments') {
      const content = JSON.parse(clause.content);
      if (Object.keys(content).length && (content.partyASignature || content.partyBSignature)) {
        for (const [key, value] of Object.entries(content)) {
          if (key === 'partyASignature' || key === 'partyBSignature') {
            const attachmentFile = await this.uploadService.retrieveAndReturnBlob(value);
            if (attachmentFile) {
              const attachmentData = new FormData();
              attachmentData.append('fileContent', attachmentFile);
              attachmentData.append('entityType', 'contract_clause_attachment');
              attachmentData.append('clauseAppRef', clause.appRef);
              attachmentData.append('contentField', key);
              this.apiService.post('file-upload', attachmentData).subscribe((res: any) => {
                if (res?.status !== 'OK')  {
                  console.error(`Failed to sync contract clause attachment for clause ${clause.name} to the api`, res);
                }
              });
            }
          }
        }
      }
    }
  }

  async fetchContractClauses() {
    return await lastValueFrom(this.apiService.get('contracts-clauses')).then(async(response: GetClausesResponse) => {
      if (response.status === 200 && response.body.data.length > 0) {
        for (const clause of response.body.data) {
          const contract = await this.contractServ.getContractByField('onlineRef', clause.contract);
          if (contract) {
            const clauseExists = await this.dbService.checkIfEntryExists('contract_clauses', clause.appRef);
            if (!clauseExists) {
              const data = JSON.parse(clause.content);
              delete data.partyASignature;
              delete data.partyBSignature;
              const clauseToSave = {
                ...clause,
                content: JSON.stringify(data),
              };
              await this.contractServ.saveOnlineContractClause(contract?.id, clauseToSave).then(async(id) => {
                const content = JSON.parse(clause.content);
                if (Object.keys(content).length && (content.partyASignature || content.partyBSignature)) {
                  for (const [key, value] of Object.entries(content)) {
                    if (key === 'partyASignature' || key === 'partyBSignature') {
                      await this.uploadService.fetchAndSaveFile(value).then(async(fileUri) => {
                        if (fileUri) {
                          content[key] = fileUri;
                        }
                      });
                    }
                  }
                  // Save party signatures
                  const dataToUpdate = {
                    ...clause,
                    content: JSON.stringify(content),
                    updated_at: clause.updatedAt,
                    updated_by: clause.updatedBy,
                  };
                  await this.contractServ.updateContractClause(id, dataToUpdate);
                }
              });
            } else {
              const currentClause = await this.contractServ.contractClauses.find(c => c.appRef === clause.appRef);
              const currentUpdateDate = new Date(currentClause?.updatedAt);
              const newUpdateDate = new Date(clause.updatedAt);
              if (currentUpdateDate < newUpdateDate) {
                const data = JSON.parse(clause.content);
                delete data.partyASignature;
                delete data.partyBSignature;
                const clauseToUpdate = {
                  ...clause,
                  content: JSON.stringify(data),
                  updated_at: clause.updatedAt,
                  updated_by: clause.updatedBy,
                };
                clauseToUpdate['id'] = currentClause.id;
                await this.contractServ.updateContractClause(currentClause.id, clauseToUpdate).then(() => {
                  console.log(`Contract clause ${clause.name} for user ${contract.name} updated successfully.`);
                });

                const content = JSON.parse(clause.content);
                if (Object.keys(content).length && (content.partyASignature || content.partyBSignature)) {
                  let fileChanged = false;
                  for (const [key, value] of Object.entries(content)) {
                    if (key === 'partyASignature' || key === 'partyBSignature') {
                      const currentSignature = currentClause ? JSON.parse(currentClause.content)[key] : null;
                      const currentFileName = currentSignature ? currentSignature.split('files/')[1] : null;
                      const isCurrentSignatureSameAsNew = currentFileName && value && typeof value === 'string' && value?.includes(currentFileName);
                      if (isCurrentSignatureSameAsNew) {
                        content[key] = currentSignature;
                        continue;
                      }
                      await this.uploadService.fetchAndSaveFile(value).then(async(fileUri) => {
                        if (fileUri) {
                          content[key] = fileUri;
                          fileChanged = true;
                        }
                      });
                    }
                  }

                  if (fileChanged) {
                    // Save party signatures
                    const dataToUpdate = {
                      ...clause,
                      content: JSON.stringify(content),
                      updated_at: clause.updatedAt,
                      updated_by: clause.updatedBy,
                    };
                    await this.contractServ.updateContractClause(currentClause.id, dataToUpdate);
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async syncSurveyResponses() {
    const isValid = await this.authService.checkAcessTokenValidity();
    if (!isValid || !this.isDbInitialized || !navigator.onLine) {
      return;
    }

    const surveys = this.surveyDataService.surveys;
    if (surveys?.length) {
      for (const survey of surveys) {
        // Survey responses are saved to the db then synced to the api
        // After sync the response is deleted from the local db
        // We never fetch them from the api so the onlineRef isn't neccessary
        const surveyId = survey.id;
        const surveyToUpload = Object.assign({}, survey);
        surveyToUpload.surveyDate = new Date(survey.surveyDate).toISOString().split('T')[0];
        delete surveyToUpload.id;
        if (surveyToUpload?.userId) {
          surveyToUpload.user = surveyToUpload.userId;
        }
        await lastValueFrom(this.apiService.post('surveys', surveyToUpload)).then(async(response: CreateSurveyResp) => {
          if (response?.status === 'OK') {
            await this.surveyDataService.delete(surveyId);
          }
        }).catch(e => console.error(e));
      }
    }
  }

  async syncInlineQuestions() {
    const isValid = await this.authService.checkAcessTokenValidity();
    if (!isValid || !this.isDbInitialized || !navigator.onLine) {
      return;
    }

    const questions = this.surveyDataService.inlineQuestions;
    if (questions?.length) {
      const user = await this.sharedMethods.getUserData();
      for (const question of questions) {
        if (user?.id !== question?.createdBy) { continue; }

        const questionToUpload = Object.assign({}, question);
        delete questionToUpload.id;
        questionToUpload.user = questionToUpload.userId;
        if (!questionToUpload.onlineRef) {
          this.apiService.post('inline-questions', questionToUpload).subscribe(async(response: any) => {
            if (response?.status === 'OK') {
              this.dbService.updateDatabaseField('inline_questions', 'online_ref', response.data.id, question.appRef);
            }
          });
        } else {
          this.apiService.put('inline-questions', questionToUpload.onlineRef, questionToUpload).subscribe(async(response: any) => {
            if (response?.status !== 'OK') {
              console.error('Failed to update inline question', response);
            }
          });
        }
      }
    }
  }

  async fetchInlineQuestions() {
    return await lastValueFrom(this.apiService.get('inline-questions')).then(async(response) => {
      if (response.status === 200 && response.body.data.length > 0) {
        for (const question of response.body.data) {
          const now = this.sharedMethods.getCurrentDateTime();
          const user = await this.sharedMethods.getUserData();
          const questionToSave = {
            ...question,
            userId: question.user,
            onlineRef: question.id,
            createdAt: question.createdAt ??  now,
            updatedAt: question.updatedAt ??  now,
            createdBy: question.createdBy ?? user?.id,
            updatedBy: question.updatedBy ?? user?.id,
          };
          delete questionToSave.id;
          const exists = await this.dbService.checkIfEntryExists('inline_questions', question.appRef);
          if (!exists) {
            this.surveyDataService.saveOnlineInlineQuestion(questionToSave)
            .then((id) => { console.log ( `Inline question ${question.questionText} saved with id ${id}`); });
          } else {
            const currentQtn = await this.surveyDataService.inlineQuestions.find(q => q.appRef === question.appRef);
            const currentUpdateDate = new Date(currentQtn?.updatedAt);
            const newUpdateDate = new Date(question.updatedAt);
            if (currentUpdateDate < newUpdateDate) {
              questionToSave['id'] = currentQtn.id;
              await this.surveyDataService.updateInlineQuestion(questionToSave).then(() => {
                console.log(`Inline question ${question.questionText} updated successfully.`);
              });
            }
          }
        }
      }
    });
  }

  async syncUsersData() {
    const isValid = await this.authService.checkAcessTokenValidity();
    if (!isValid || !this.isDbInitialized || !navigator.onLine) {
      return;
    }
    await this.syncProfiles();
    await this.fetchProfile();
    await this.fetchProfilesByRole();
  }

  // fetches current user's profile only
  async fetchProfile() {
    const response: GetProfileResponse = await lastValueFrom(this.apiService.get('accounts/profile'));
    if (response.status === 200 && response.body.data) {
      const user = await this.sharedMethods.getUserData();
      const now = this.sharedMethods.getCurrentDateTime();
      const role = response.body.data?.roles?.length ? response.body.data?.roles.join(',') : '';
      const dataToSave = {...response.body.data, userRole: role};
      dataToSave.createdAt = dataToSave.createdAt ??  now;
      dataToSave.updatedAt = dataToSave.updatedAt ??  now;
      dataToSave.createdBy = dataToSave.createdBy ?? user?.id;
      dataToSave.updatedBy = dataToSave.updatedBy ?? user?.id;
      const profileExists = await this.profilesDataService.checkIfProfileExists(dataToSave.email);
      if (!profileExists) {
        await this.profilesDataService.saveOnlineProfile(dataToSave).then(async() => {
          if (dataToSave?.profileImage) {
            await this.uploadService.fetchAndSaveFile(dataToSave.profileImage).then(async(fileUri) => {
              if (fileUri) {
                await this.profilesDataService.updateProfilesField(dataToSave.email, 'profile_image', fileUri);
              }
            });
          }
          await this.fetchBankAccounts(dataToSave.id);
          await this.fetchBeneficiaries(dataToSave.id);
        }).catch((e) => console.error(e));
      } else {
        const currentProfile = await this.profilesDataService.getSingleProfile(dataToSave.email);
        const currentDate = new Date(currentProfile?.updatedAt);
        const newDate = new Date(dataToSave?.updatedAt);

        if (!currentProfile?.onlineRef) {
          // update onlineref if not exists
          await this.profilesDataService.updateProfileOnlineRef(dataToSave.email, dataToSave.id);
        }
        if (currentDate < newDate) {
          await this.profilesDataService.update(dataToSave).then(async() => {
            if (dataToSave?.profileImage) {
              await this.uploadService.fetchAndSaveFile(dataToSave.profileImage).then(async(fileUri) => {
                if (fileUri) {
                  await this.profilesDataService.updateProfilesField(dataToSave.email, 'profile_image', fileUri);
                }
              });
            }
            await this.fetchBankAccounts(dataToSave.id);
            await this.fetchBeneficiaries(dataToSave.id);
          });
        }
      }
    }
  }

  // fetches profiles by role
  async fetchProfilesByRole() {
    const roles = await this.getRolesToFetch();
    if (roles?.length) {
      roles.forEach(async(role) => {
        this.apiService.get('accounts/users', false, {role}).subscribe(async(response: GetUsersResponse) => {
          if (response.status === 200 && response.body.data.length > 0) {
            response.body.data.forEach(async(profile) => {
              const user: UserData = await this.sharedMethods.getUserData();
              const now = this.sharedMethods.getCurrentDateTime();
              const rolesToSave = profile?.roles?.length ? profile?.roles.join(',') : '';
              const dataToSave = {...profile, userRole: rolesToSave};
              dataToSave.createdAt = dataToSave.createdAt ??  now;
              dataToSave.updatedAt = dataToSave.updatedAt ??  now;
              dataToSave.createdBy = dataToSave.createdBy ?? user?.id;
              dataToSave.updatedBy = dataToSave.updatedBy ?? user?.id;
              const profileExists = await this.profilesDataService.checkIfProfileExists(dataToSave.email);
              if (!profileExists) {
                await this.profilesDataService.saveOnlineProfile(dataToSave).then(async() => {
                  if (dataToSave?.profileImage) {
                    await this.uploadService.fetchAndSaveFile(dataToSave.profileImage).then(async(fileUri) => {
                      if (fileUri) {
                        await this.profilesDataService.updateProfilesField(dataToSave.email, 'profile_image', fileUri);
                      }
                    });
                  }
                  await this.fetchBankAccounts(dataToSave.id);
                  await this.fetchBeneficiaries(dataToSave.id);
                }).catch((e) => console.error(e));
              } else {
                const currentProfile = await this.profilesDataService.getSingleProfile(dataToSave.email);
                const currentDate = new Date(currentProfile?.updatedAt);
                const newDate = new Date(dataToSave?.updatedAt);
                if (!currentProfile?.onlineRef) {
                  // update onlineref if not exists
                  await this.profilesDataService.updateProfileOnlineRef(dataToSave.email, dataToSave.id);
                }
                if (currentDate < newDate) {
                  await this.profilesDataService.update(dataToSave).then(async() => {
                    if (dataToSave?.profileImage) {
                      await this.uploadService.fetchAndSaveFile(dataToSave.profileImage).then(async(fileUri) => {
                        if (fileUri) {
                          await this.profilesDataService.updateProfilesField(dataToSave.email, 'profile_image', fileUri);
                        }
                      });
                    }
                    await this.fetchBankAccounts(dataToSave.id);
                    await this.fetchBeneficiaries(dataToSave.id);
                  });
                }
              }
            });
          }
        });
      });
    }
  }

  async getRolesToFetch() {
    const user: UserData = await this.sharedMethods.getUserData();
    switch (user.role) {
      case UserRole.worker:
        return [];
      case UserRole.vesselOwner:
        return [ UserRole.worker, UserRole.taiwaneseAgent, UserRole.indonesianAgent];
      case UserRole.taiwaneseAgent:
      case UserRole.indonesianAgent:
      case UserRole.buyer:
        return [UserRole.worker];
      default:
        return [];
    }
  }

  // Syncs all local profiles to the API
  async syncProfiles() {
    const profiles = await this.profilesDataService.retrieveProfiles();
    return profiles?.forEach(async(profile) => {
      const profileId = profile.id;
      let hasProfileImage = false;
      if (profile.onlineRef) {
        // remove fields without values so that they aren't sent to the api
        for (const [key, value] of Object.entries(profile)) {
          if (value === null || value === undefined || value === '') {
            delete profile[key];
          }
        }
        const profileToUpload = Object.assign({}, profile);
        profileToUpload.userId = profile?.onlineRef;
        delete profileToUpload.id;
        if (profileToUpload?.profileImage) {
          delete profileToUpload.profileImage;
          hasProfileImage = true;
        }
        return this.apiService.post(
          'accounts/profile',
          profileToUpload, false,
          {userId: profile?.onlineRef}
        ).subscribe(async(response: CreateProfileResponse) => {
          if (response?.status === 'OK') {
            if (hasProfileImage) {
              await this.postProfileImage(profile, profile?.onlineRef);
            }
            await this.syncBankAccounts(profileId, response?.data?.id);
            await this.syncBeneficiaries(profileId, response?.data?.id);
          } else {
            console.error(`Failed to sync profile ${profile.email} to the api`, response);
          }
        });
      } else {
        // register user to the api
        const profileToRegister = Object.assign({}, profile);
        delete profileToRegister.id;
        if (profileToRegister?.profileImage) {
          delete profileToRegister.profileImage;
          hasProfileImage = true;
        }
        return this.apiService.post(
          'accounts/profile',
          profileToRegister,
          false,
          {register: 'register'}
        ).subscribe(async(response: CreateProfileResponse) => {
          if (response?.status === 'OK') {
            await this.profilesDataService.updateProfileOnlineRef(profile.email, response?.data?.id);
            if (hasProfileImage) {
              await this.postProfileImage(profile, response?.data?.id);
            }
            await this.syncBankAccounts(profileId, response?.data?.id);
            await this.syncBeneficiaries(profileId, response?.data?.id);
          } else {
            console.error(`Failed to sync/register profile ${profile.email} to the api`, response);
          }
        });
      }
    });
  }

  async postProfileImage(profile, profileOnlineRef) {
    const imageFile = await this.uploadService.retrieveAndReturnBlob(profile.profileImage);
    if (imageFile) {
      const imageData = new FormData();
      imageData.append('fileContent', imageFile);
      imageData.append('entityType', 'profile_picture');
      imageData.append('userId', profileOnlineRef);
      this.apiService.post('file-upload', imageData).subscribe((res: any) => {
        if (res?.status !== 'OK') {
          console.error(`Failed to sync profile image for user ${profile.email} to the api`, res);
        }
      });
    }
  }

  async fetchBankAccounts(profileOnlineRef) {
    return await lastValueFrom(this.apiService.get(
      'accounts/bank-details',
      false,
      {userId: profileOnlineRef}
    )).then(async(response: GetBankAccountsResponse) => {
      if (response.status === 200 && response.body.data.length > 0) {
        for (const bankAccount of response.body.data) {
          const profile = await this.profilesDataService.getProfileByOnlineRef(bankAccount.user);
          if (profile?.id) {
            bankAccount.createdBy = bankAccount.createdBy ?? profile.id;
            bankAccount.updatedBy = bankAccount.updatedBy ?? profile.id;
            const data = Object.assign({}, bankAccount);
            delete data.id;
            const dataToSave = {...data, userId: profile.id, onlineRef: bankAccount.id};

            const accountExists = await this.dbService.checkIfEntryExists('user_bank_accounts', bankAccount.appRef);
            if (!accountExists) {
              await this.paymentsDataService.createBankAccount(dataToSave).then(() => {});
            } else {
              const currentAccount = await this.paymentsDataService.bankAccounts.find(b => b.appRef === bankAccount.appRef);
              const currentDate = new Date(currentAccount?.updatedAt);
              const newDate = new Date(bankAccount.updatedAt);
              if (currentDate < newDate) {
                dataToSave.id = currentAccount.id;
                await this.paymentsDataService.updateBankAccount(dataToSave);
              }
            }
          }
        }
      }
    });
  }

  async syncBankAccounts(profileId, userOnlineRef ) {
    const accounts = await this.paymentsDataService.getUserBankAccounts(profileId);
    for (const account of accounts) {
      if (userOnlineRef !== account?.createdBy) { continue; }

      const acctToUpload = Object.assign({}, account);
      delete acctToUpload.id;
      acctToUpload.userId = userOnlineRef;
      if (!acctToUpload.onlineRef) {
        this.apiService.post('accounts/bank-details', acctToUpload).subscribe((response: CreateBankAccountResponse) => {
          if (response?.status === 'OK') {
            this.dbService.updateDatabaseField('user_bank_accounts', 'online_ref', response?.data?.id, account.appRef);
          } else {
            console.error(`Failed to sync bank account ${account.accountNumber} to the api`, response);
          }
        });
      } else {
        this.apiService.put('accounts/bank-details', acctToUpload.onlineRef, acctToUpload).subscribe((response: any) => {
          if (response?.status !== 'OK') {
            console.error(`Failed to update bank account ${account.accountNumber} to the api`, response);
          }
        });
      }
    }
  }

  async fetchBeneficiaries(profileOnlineRef) {
    return await lastValueFrom(this.apiService.get(
      'accounts/beneficiaries-bank-details',
      false,
      {userId: profileOnlineRef}
    )).then(async(response: GetBeneficiaryResponse) => {
      if (response.status === 200 && response.body.data.length > 0) {
        for (const beneficiary of response.body.data) {
          const profile = await this.profilesDataService.getProfileByOnlineRef(beneficiary.user);
          if (profile?.id) {
            beneficiary.createdBy = beneficiary.createdBy ?? profile.id;
            beneficiary.updatedBy = beneficiary.updatedBy ?? profile.id;
            const data = Object.assign({}, beneficiary);
            delete data.id;
            const beneficiaryExists = await this.dbService.checkIfEntryExists('user_beneficiaries', beneficiary.appRef);
            if (!beneficiaryExists) {
              const dataToSave = {...data, userId: profile.id, onlineRef: beneficiary.id};
              await this.paymentsDataService.createBeneficiary(dataToSave).then(() => {});
            } else {
              const currentBeneficiary = await this.paymentsDataService.beneficiaries.find(b => b.appRef === beneficiary.appRef);
              const currentDate = new Date(currentBeneficiary?.updatedAt);
              const newDate = new Date(beneficiary.updatedAt);
              if (currentDate < newDate) {
                beneficiary.id = currentBeneficiary.id;
                await this.paymentsDataService.updateBeneficiary(beneficiary);
              }
            }
          }
        }
      }
    });
  }

  async syncBeneficiaries(profileId, userOnlineRef) {
    const beneficiaries = await this.paymentsDataService.getUserBeneficiaries(profileId);
    for (const beneficiary of beneficiaries) {
      if (userOnlineRef !== beneficiary?.createdBy) { continue; }

      const dataToUpload = Object.assign({}, beneficiary);
      delete dataToUpload.id;
      dataToUpload.userId = userOnlineRef;
      if (!dataToUpload.onlineRef) {
        this.apiService.post('accounts/beneficiaries-bank-details', dataToUpload).subscribe((response: CreateBeneficiaryResponse) => {
          if (response?.status === 'OK') {
            this.dbService.updateDatabaseField('user_beneficiaries', 'online_ref', response?.data?.id, beneficiary.appRef);
          } else {
            console.error(`Failed to sync beneficiary ${beneficiary.fName} to the api`, response);
          }
        });
      } else {
        this.apiService.put('accounts/beneficiaries-bank-details', dataToUpload.onlineRef, dataToUpload).subscribe((response: any) => {
          if (response?.status !== 'OK') {
            console.error(`Failed to update beneficiary ${beneficiary.fName} to the api`, response);
          }
        });
      }
    }
  }

  async syncMyDocuments() {
    const isValid = await this.authService.checkAcessTokenValidity();
    if (!isValid || !this.isDbInitialized || !navigator.onLine) {
      return;
    }

    const allDocs = this.documentsDataService.allDocuments;
    if (allDocs?.length) {
      const user = await this.sharedMethods.getUserData();
      for (const document of allDocs) {
        if (user?.id !== document?.createdBy) { continue; }

        if (document.isDeleted && !document.onlineRef) {
          await this.documentsDataService.deleteDocument(document.id);
        } else if (document.isDeleted && document.onlineRef) {
          this.apiService.delete('mydocuments', document.onlineRef).subscribe(async(response: any) => {
            if (response?.status === 'OK' || !response) {
              await this.documentsDataService.deleteDocument(document.id);
            } else {
              console.error(`Failed to delete document ${document.fileName} from the api`, response);
            }
          });
        } else {
          const documentToUpload = Object.assign({}, document);
          delete documentToUpload.id;
          delete documentToUpload.fileUrl;
          
          const file = await this.uploadService.retrieveAndReturnBlob(document.fileUrl);
          if (file) {
            const docData =  new FormData();
            docData.append('fileContent', file);
            docData.append('entityType', 'my_document');
            docData.append('docId', documentToUpload.onlineRef || '');
            docData.append('appRef', documentToUpload.appRef);
            docData.append('userId', documentToUpload.userId);
            docData.append('fileName', documentToUpload.fileName);
            docData.append('docType', documentToUpload.docType);
            docData.append('fileSize', documentToUpload.fileSize.toString());
            docData.append('isEssential', documentToUpload.isEssential ? 'true' : 'false');
            docData.append('createdAt', documentToUpload.createdAt);
            docData.append('updatedAt', documentToUpload.updatedAt);
            docData.append('createdBy', documentToUpload.createdBy);
            docData.append('updatedBy', documentToUpload.updatedBy); 
            this.apiService.post('file-upload', docData).subscribe((uploadResponse: any) => {
              if (uploadResponse?.status === 'OK') {
                documentToUpload.fileUrl = uploadResponse?.data?.fileLocation;

                if (!documentToUpload.onlineRef && uploadResponse?.data?.document?.id) {
                  this.dbService.updateDatabaseField('documents', 'online_ref', uploadResponse.data.document.id, documentToUpload.appRef);
                }
              } else {
                console.error(`Failed to sync document ${document.fileName} to the api`, uploadResponse);
              }
            });
          }
        }
      }
    }
  }

  async fetchMyDocuments() {
    return await lastValueFrom(this.apiService.get('mydocuments')).then(async(response) => {
      if (response?.status === 200 && response.body.data.length > 0) {
        for (const doc of response.body.data) {
          const docExists = await this.dbService.checkIfEntryExists('documents', doc.appRef);
          if (!docExists) {
            const fileUri = await this.uploadService.fetchAndSaveFile(doc.fileUrl);
            if (fileUri) {
              const user = await this.sharedMethods.getUserData();
              const now = this.sharedMethods.getCurrentDateTime();
              const dataToSave = {
                ...doc,
                userId: doc.user,
                fileUrl: fileUri,
                createdAt: doc.createdAt ??  now,
                updatedAt: doc.updatedAt ??  now,
                createdBy: doc.createdBy ?? user?.id,
                updatedBy: doc.updatedBy ?? user?.id,
                onlineRef: doc.id,
              };
              await this.documentsDataService.saveOnlineDocument(dataToSave).then(() => {});
            }
          } else {
            const currentDoc = await this.documentsDataService.allDocuments.find(d => d.onlineRef === doc.id);
            const currentDate = new Date(currentDoc?.updatedAt);
            const newDate = new Date(doc.updatedAt);
            if (currentDate < newDate) {
              const currentFileName = currentDoc?.fileUrl ? currentDoc?.fileUrl.split('files/')[1] : null;
              const isCurrentFileSameAsNew = currentFileName && doc.fileUrl && doc.fileUrl.includes(currentFileName);
              const docToUpdate = {...doc};

              if (isCurrentFileSameAsNew) {
                docToUpdate.fileUrl = currentDoc?.fileUrl;
              } else {
                const fileUri = await this.uploadService.fetchAndSaveFile(doc.fileUrl);
                if (fileUri) {
                  docToUpdate.fileUrl = fileUri;
                }
              }
              docToUpdate.id = currentDoc.id;
              await this.documentsDataService.update(docToUpdate);
            }
          }
        }
      }
    });
  }

  async syncPassports() {
    const isValid = await this.authService.checkAcessTokenValidity();
    if (!isValid || !this.isDbInitialized || !navigator.onLine) {
      return;
    }

    const passports = this.documentsDataService.passports;
    if (passports.length > 0) {
      const user = await this.sharedMethods.getUserData();
      for (const passport of passports) {
        if (user?.id !== passport?.createdBy) { continue; }
        const dataToSave = Object.assign({}, passport);
        delete dataToSave.id;
        delete dataToSave.imageUrl;
        dataToSave.user = passport.userId;
        dataToSave.dateOfIssue = new Date(dataToSave.dateOfIssue).toISOString().split('T')[0];
        dataToSave.dateOfExpiry = new Date(dataToSave.dateOfExpiry).toISOString().split('T')[0];
        if (!dataToSave.onlineRef) {
          if (passport.isDeleted) {
            await this.documentsDataService.deletePassport(passport.id);
          } else {
            this.apiService.post('passports', dataToSave).subscribe(async(response: any) => {
              if (response?.status === 'OK') {
                this.dbService.updateDatabaseField('passports', 'online_ref', response?.data?.id, passport.appRef);
                const file = await this.uploadService.retrieveAndReturnBlob(passport.imageUrl);
                if (file) {
                  const imageData = new FormData();
                  imageData.append('fileContent', file);
                  imageData.append('entityType', 'passport');
                  imageData.append('passportId', response?.data?.id);

                  this.apiService.post('file-upload', imageData).subscribe((res: any) => {
                    if (res?.status !== 'OK') {
                      console.error(`Failed to sync passport image, ${passport.appRef} to the api`, res);
                    }
                  });
                }
              }
            });
          }
        } else {
          if (passport.isDeleted) {
            this.apiService.delete('passports', passport.onlineRef).subscribe(async(response: any) => {
              if (response?.status === 'OK' || !response) {
                await this.documentsDataService.deletePassport(passport.id);
              } else {
                console.error(`Failed to delete passport ${passport.appRef} from the api`, response);
              }
            });
          } else {
            this.apiService.put('passports', passport.onlineRef, dataToSave).subscribe(async(response: any) => {
              if (response?.status === 'OK') {
                const file = await this.uploadService.retrieveAndReturnBlob(passport.imageUrl);
                if (file) {
                  const imageData = new FormData();
                  imageData.append('fileContent', file);
                  imageData.append('entityType', 'passport');
                  imageData.append('passportId', passport.onlineRef);
                  this.apiService.post('file-upload', imageData).subscribe((res: any) => {
                    if (res?.status !== 'OK') {
                      console.error(`Failed to sync passport image, ${passport.appRef} to the api`, res);
                    }
                  });
                }
              }
            });
          }
        }
      }
    }
  }

  async fetchPassports() {
    return await lastValueFrom(this.apiService.get('passports')).then(async(response: any) => {
      if (response?.status === 200 && response.body.data.length > 0) {
        for (const passport of response.body.data) {
          const passportExists = await this.dbService.checkIfEntryExists('passports', passport.appRef);
          if (!passportExists) {
            const fileUri = await this.uploadService.fetchAndSaveFile(passport.imageUrl);
            if (fileUri) {
              const user = await this.sharedMethods.getUserData();
              const now = this.sharedMethods.getCurrentDateTime();
              const dataToSave = {
                ...passport,
                userId: passport.user,
                imageUrl: fileUri,
                createdAt: passport.createdAt ??  now,
                updatedAt: passport.updatedAt ??  now,
                createdBy: passport.createdBy ?? user?.id,
                updatedBy: passport.updatedBy ?? user?.id,
                onlineRef: passport.id,
              };
              delete dataToSave.id;
              await this.documentsDataService.saveOnlinePassport(dataToSave).then(() => {});
            }
          } else {
            const currentPassport = await this.documentsDataService.passports.find(p => p.onlineRef === passport.id);
            const currentDate = new Date(currentPassport?.updatedAt);
            const newDate = new Date(passport.updatedAt);
            if (currentDate < newDate) {
              const currentFileName = currentPassport?.imageUrl ? currentPassport?.imageUrl.split('files/')[1] : null;
              const isCurrentFileSameAsNew = currentFileName && passport.imageUrl && passport.imageUrl.includes(currentFileName);

              if (isCurrentFileSameAsNew) {
                passport.imageUrl = currentPassport?.imageUrl;
              } else {
                const fileUri = await this.uploadService.fetchAndSaveFile(passport.imageUrl);
                if (fileUri) {
                  passport.imageUrl = fileUri;
                }
              }
              passport.id = currentPassport.id;
              await this.documentsDataService.updatePassport(passport);
            }
          }
        }
      }
    });
  }

  async syncLearningHubProgress() {
    const isValid = await this.authService.checkAcessTokenValidity();
    if (!isValid) {
      return;
    }

    const savedLearningHubProgress = await this.sharedMethods.readDataFromStorage(StorageKeys.learningHubProgress);
    if (!savedLearningHubProgress) {
      return;
    }

    const objToUpload = Object.assign({}, savedLearningHubProgress);
    delete objToUpload.id;
    delete objToUpload.appRef;
    this.apiService.post('learninghub-progress/', objToUpload).subscribe(async(response: any) => {
      if (response?.status !== 'OK') {
        console.error(`Failed to sync learning hub progress data to the api`, response);
      }
    });

  }

  async fetchLearningHubProgress() {
    return this.apiService.get('learninghub-progress').subscribe(async(response: any) => {
      if (response?.status === 200 && response?.body?.data?.length > 0) {
        const onlineLearningHubProgress = response.body.data[0];
        const savedLearningHubProgress = await this.sharedMethods.readDataFromStorage(StorageKeys.learningHubProgress);
        // Check if device records are up to date
        if (savedLearningHubProgress && savedLearningHubProgress?.updatedAt) {
          const currentUpdateDate = new Date(savedLearningHubProgress?.updatedAt);
          const newUpdateDate = new Date(onlineLearningHubProgress.updatedAt);
          if (currentUpdateDate >= newUpdateDate) {
            // Since online records are old don't update app records
            return;
          }
        }
        await this.sharedMethods.saveDataToStorage(StorageKeys.learningHubProgress, onlineLearningHubProgress);
      }
    });
  }

  async fetchWages() {
    return await lastValueFrom(this.apiService.get('wages')).then(async(response: any) => {
      if (response?.status === 200 && response.body.length > 0) {
        for (const wage of response.body) {
          const user = await this.sharedMethods.getUserData();
          const now = this.sharedMethods.getCurrentDateTime();
          const wageToSave = {
            ...wage,
            onlineRef: wage.id,
            userId: wage.user,
            vesselId: wage.vessel,
            createdAt: wage.createdAt ??  now,
            updatedAt: wage.updatedAt ??  now,
            createdBy: wage.createdBy ?? user?.id,
            updatedBy: wage.updatedBy ?? user?.id,
            whyTheDiscrepancy: wage?.whyTheDiscrepancy ? JSON.stringify(wage.whyTheDiscrepancy) : null,
          };
          // files are handled separately below
          delete wageToSave.payslip;
          delete wageToSave.crewBankTransferReceipt;
          delete wageToSave.beneficiaryBankTransferReceipt;
          
          const wageExists = await this.wagesDataService.checkIfWageExists(wage.id);
          if (!wageExists) {
            if (wage?.payslip) {
              const fileUri = await this.uploadService.fetchAndSaveFile(wage.payslip);
              wageToSave.payslip = fileUri ?? null;
            }
            if (wage?.crewBankTransferReceipt) {
              const fileUri = await this.uploadService.fetchAndSaveFile(wage.crewBankTransferReceipt);
              wageToSave.crewBankTransferReceipt = fileUri ?? null;
            }
            if (wage?.beneficiaryBankTransferReceipt) {
              const fileUri = await this.uploadService.fetchAndSaveFile(wage.beneficiaryBankTransferReceipt);
              wageToSave.beneficiaryBankTransferReceipt = fileUri ?? null;
            }
            
            await this.wagesDataService.saveOnlineWage(wageToSave).then(() => {
              console.log(`Wage for user ${wageToSave.userId} saved successfully.`);
            });
          } else {
            const currentWage = await this.wagesDataService.wages.find(w => w.onlineRef === wage.id);
            const currentUpdateDate = new Date(currentWage?.updatedAt);
            const newUpdateDate = new Date(wage.updatedAt);
            if (currentUpdateDate < newUpdateDate) {
              const currentPayslipFilename = currentWage?.payslip ? currentWage.payslip.split('files/')[1] : null;
              const isCurrentPayslip = currentPayslipFilename && wage.payslip && wage.payslip.includes(currentPayslipFilename);
              if (wage?.payslip && !isCurrentPayslip) {
                const fileUri = await this.uploadService.fetchAndSaveFile(wage.payslip);
                wageToSave.payslip = fileUri ?? null;
              } else if (wage?.payslip && isCurrentPayslip) {
                wageToSave.payslip = currentWage.payslip;
              }
              
              const currentCrewBankTransferReceiptFilename = currentWage?.crewBankTransferReceipt ? currentWage.crewBankTransferReceipt.split('files/')[1] : null;
              const isCurrentCrewBankTransferReceipt = currentCrewBankTransferReceiptFilename && wage.crewBankTransferReceipt && wage.crewBankTransferReceipt.includes(currentCrewBankTransferReceiptFilename);
              if (wage?.crewBankTransferReceipt && !isCurrentCrewBankTransferReceipt) {
                const fileUri = await this.uploadService.fetchAndSaveFile(wage.crewBankTransferReceipt);
                wageToSave.crewBankTransferReceipt = fileUri ?? null;
              } else if (wage?.crewBankTransferReceipt && isCurrentCrewBankTransferReceipt) {
                wageToSave.crewBankTransferReceipt = currentWage.crewBankTransferReceipt;
              }
              
              const currentBeneficiaryBankTransferReceiptFilename = currentWage?.beneficiaryBankTransferReceipt ? currentWage.beneficiaryBankTransferReceipt.split('files/')[1] : null;
              const isCurrentBeneficiaryBankTransferReceipt = currentBeneficiaryBankTransferReceiptFilename && wage.beneficiaryBankTransferReceipt && wage.beneficiaryBankTransferReceipt.includes(currentBeneficiaryBankTransferReceiptFilename);
              if (wage?.beneficiaryBankTransferReceipt && !isCurrentBeneficiaryBankTransferReceipt) {
                const fileUri = await this.uploadService.fetchAndSaveFile(wage.beneficiaryBankTransferReceipt);
                wageToSave.beneficiaryBankTransferReceipt = fileUri ?? null;
              } else if (wage?.beneficiaryBankTransferReceipt && isCurrentBeneficiaryBankTransferReceipt) {
                wageToSave.beneficiaryBankTransferReceipt = currentWage.beneficiaryBankTransferReceipt;
              }

              await this.wagesDataService.update(wageToSave, currentWage.id).then(() => {
                console.log(`Wage for user ${wageToSave.userId} updated successfully.`);
              });
            }
          }
        }
      }
    });
  }

  async syncWages() {
    const isValid = await this.authService.checkAcessTokenValidity();
    if (!isValid || !this.isDbInitialized || !navigator.onLine) {
      return;
    }

    const wages = this.wagesDataService.wages;
    if (wages.length > 0) {
      for (const wage of wages) {
        const wageToUpload = new FormData();
        wageToUpload.append('user', wage.userId);
        wageToUpload.append('vessel', wage.vesselId);
        
        const uploadData = Object.assign({}, wage);
        delete uploadData.id;
        delete uploadData.userId;
        delete uploadData.vesselId;
        delete uploadData.onlineRef;
        for (const [key, value] of Object.entries(uploadData)) {
          if (value !== null && value !== undefined) {
            if (key === 'whyTheDiscrepancy' && uploadData.whyTheDiscrepancy?.length) {
              wageToUpload.append(key, JSON.stringify(value));
            } else if (key === 'payslip' || key === 'crewBankTransferReceipt' || key === 'beneficiaryBankTransferReceipt') {
              const file = await this.uploadService.retrieveAndReturnBlob(value);
              if (file) {
                wageToUpload.append(key, file);
              }
            } else {
              wageToUpload.append(key, value.toString());
            }
          }
        }

        if (!wage?.onlineRef) {
          this.apiService.post('wages', wageToUpload).subscribe(async(response: any) => {
            if (response?.status === 'OK') {
              await this.wagesDataService.updateOnlineRef(wage.id, response?.data?.id);
            } else {
              console.error(`Failed to sync wage for user ${wage.userId} to the api`, response);
            }
          });
        } else {
          this.apiService.put('wages', wage.onlineRef, wageToUpload).subscribe(async(response: any) => {
            if (response?.status !== 'OK') {
              console.error(`Failed to update wage for user ${wage.userId} to the api`, response);
            }
          });
        }
      }
    }
  }

  async fetchNotifications() {
    return await lastValueFrom(this.apiService.get('notifications')).then(async(response: any) => {
      if (response?.status === 200 && response.body.data.length > 0) {
        for (const notification of response.body.data) {
          const user = await this.sharedMethods.getUserData();
          const now = this.sharedMethods.getCurrentDateTime();
          const dataToSave = {
            ...notification,
            userId: notification.user,
            createdAt: notification.createdAt ?? now,
            updatedAt: notification.updatedAt ?? now,
            createdBy: notification.createdBy ?? user?.id,
            updatedBy: notification.updatedBy ?? user?.id,
            onlineRef: notification.id,
          };
          const notificationExists = await this.notificationsDataService.checkIfNotificationExists(notification.id);
          if (!notificationExists) {
            await this.notificationsDataService.saveOnlineNotification(dataToSave).then(() => {
              console.log(`Notification for user ${dataToSave.userId} saved successfully.`);
            });
          } else {
            const currentNotification = await this.notificationsDataService.notifications.find(n => n.onlineRef === notification.id);
            const currentUpdateDate = new Date(currentNotification?.updatedAt);
            const newUpdateDate = new Date(notification.updatedAt);
            if (currentUpdateDate < newUpdateDate) {
              await this.notificationsDataService.update(currentNotification.id, dataToSave).then(() => {
                console.log(`Notification for user ${dataToSave.userId} updated successfully.`);
              });
            }
          }
        }
      }
    });
  }

  async syncNotifications() {
    const isValid = await this.authService.checkAcessTokenValidity();
    if (!isValid || !this.isDbInitialized || !navigator.onLine) {
      return;
    }

    const notifications = this.notificationsDataService.notifications;
    if (notifications.length > 0) {
      for (const notification of notifications) {
        const notificationToUpload = Object.assign({}, notification);
        delete notificationToUpload.id;
        delete notificationToUpload.userId;
        delete notificationToUpload.onlineRef;
        notificationToUpload.user = notification.userId;

        if (!notification?.onlineRef) {
          this.apiService.post('notifications', notificationToUpload).subscribe(async(response: any) => {
            if (response?.status === 'OK') {
              await this.notificationsDataService.updateNotificationField(notification.id, 'online_ref', response?.data?.id);
            } else {
              console.error(`Failed to sync notification for user ${notification.userId} to the api`, response);
            }
          });
        } else {
          this.apiService.put('notifications', notification.onlineRef, notificationToUpload).subscribe(async(response: any) => {
            if (response?.status !== 'OK') {
              console.error(`Failed to update notification for user ${notification.userId} to the api`, response);
            }
          });
        }
      }
    }
  }

}
