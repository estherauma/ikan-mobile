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
    if (!isValid || !this.isDbInitialized || !navigator.onLine) {
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
    await this.fetchPayments();
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
          this.apiService.put('companies', companyToUpload.onlineRef, companyToUpload).subscribe((response) => {
            console.log(response);
          });
        }
      }
    }
  }

  async fetchCompanies() {
    return this.apiService.get('companies').subscribe((response: GetCompaniesResponse) => {
      if (response.status === 200 && response.body.data.length > 0) {
        response.body.data.forEach((company) => {
          // if the company doesn't exist in the local db, add it
          this.dbService.checkIfEntryExists('companies', company.appRef)
          .then((exists) => {
            if (!exists) {
              this.companyServ.saveOnlineCompany(company)
              .then((id) => { console.log ( `Company ${company.name} saved with id ${id}`);});
            }
          });
        });
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

  async fetchVessels() {
    return this.apiService.get('vessels').subscribe((response: GetVesselsResponse) => {
      if (response.status === 200 && response.body.data.length > 0) {
        forkJoin(response.body.data.map(async(vessel) => {
          this.dbService.checkIfEntryExists('vessels', vessel.appRef)
          .then((exists) => {
            if (!exists) {
              this.vesselServ.saveOnlineVessel(vessel).then(async(id) => {
                console.log ( `Vessel ${vessel.name} saved with id ${id}`);
              });
            }
          });
        })).subscribe(() => {
          // fetch the vessel images after the vessels have been fetched
          this.apiService.get('vessels-images').subscribe((resp: any) => {
            if (resp?.status === 200 && resp.body.length > 0) {
              resp.body.forEach(async(image) => {
                const vessel = await this.vesselServ.getVesselByField('onlineRef', image.vessel);
                if (vessel && !vessel.imageFile.webPath) {
                  const vesselImage = await this.vesselServ.getVesselImageByVesselId(vessel.id);
                  if (!vesselImage) {
                    await this.uploadService.fetchAndSaveFile(image.imageUrl).then(async(fileUri) => {
                      if (fileUri) {
                        const user = await this.sharedMethods.getUserData();
                        const now = this.sharedMethods.getCurrentDateTime();
                        const saveObj = {
                          vesselId: vessel.id,
                          appRef: image.appRef || this.sharedMethods.generateAppRef(),
                          description: image.description,
                          imageUrl: fileUri,
                          onlineRef: image.id,
                          createdAt: image.createdAt ??  now,
                          updatedAt: image.updatedAt ??  now,
                          createdBy: image.createdBy ?? user?.id,
                          updatedBy: image.updatedBy ?? user?.id,
                        };
                        await this.vesselServ.saveOnlineVesselImage(saveObj).then(() => {});
                      }
                    });
                  }
                }
              });
            }
          });
        });
      }
    });
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
          await this.dbService.checkIfEntryExists('contracts', contract.appRef)
          .then(async(exists) => {
            if (!exists) {
              if (contract?.taiwaneseCompany) {
                const taiwaneseCompany = await this.companyServ.getCompanyByField('onlineRef', contract.taiwaneseCompany);
                contract.taiwaneseCompany = taiwaneseCompany?.id || null;
              }
              if (contract?.indonesianCompany) {
                const indonesianCompany = await this.companyServ.getCompanyByField('onlineRef', contract.indonesianCompany);
                contract.indonesianCompany = indonesianCompany?.id || null;
              }
              await this.contractServ.saveOnlineContract(contract)
              .then((id) => { console.log ( `Contract ${contract.name} saved with id ${id}`); });
            }
          });
        })).subscribe(async() => {
          // fetch the contract clauses & documents after the contracts have been fetched
          await this.fetchContractDocuments();
          await this.fetchContractClauses();
        });
      }
    });
  }

  async fetchContractDocuments() {
    return this.apiService.get('contracts-documents').subscribe((response) => {
      if (response.status === 200 && response.body.length > 0) {
        response.body.forEach(async(doc) => {
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
            }
          }
        });
      }
    });
  }

  async syncContractClauses(contractId, contractOnlineRef) {
    const isValid = await this.authService.checkAcessTokenValidity();
    if (!isValid || !this.isDbInitialized || !navigator.onLine) {
      return;
    }

    const clauses = await this.contractServ.retrieveContractClauses(contractId);
    clauses.forEach(async(clause) => {
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
          console.log('error', e);
          // TODO: save clause onlinref if no exists
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
    });
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
    return this.apiService.get('contracts-clauses').subscribe((response: GetClausesResponse) => {
      if (response.status === 200 && response.body.data.length > 0) {
        response.body.data.forEach(async(clause) => {
          await this.dbService.checkIfEntryExists('contract_clauses', clause.appRef)
          .then(async(exists) => {
            if (!exists) {
              const contract = await this.contractServ.getContractByField('onlineRef', clause.contract);
              if (contract) {
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
                  }
                  const dataToUpdate = {
                    ...clause,
                    content: JSON.stringify(content),
                    updated_at: clause.updatedAt,
                    updated_by: clause.updatedBy,
                  };
                  await this.contractServ.updateContractClause(id, dataToUpdate);
                });
              }
            } else {
              // TODO: update the clause if it exists
            }
          });
        });
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
      surveys.forEach((survey) => {
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
          this.apiService.post('surveys', surveyToUpload).subscribe(async(response: CreateSurveyResp) => {
          if (response?.status === 'OK') {
            await this.surveyDataService.delete(surveyId);
          }
        }, e => console.error(e));
      });
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
    return this.apiService.get('inline-questions').subscribe((response) => {
      if (response.status === 200 && response.body.data.length > 0) {
        response.body.data.forEach((question) => {
          this.dbService.checkIfEntryExists('inline_questions', question.appRef)
          .then(async(exists) => {
            if (!exists) {
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
              this.surveyDataService.saveOnlineInlineQuestion(questionToSave)
              .then((id) => { console.log ( `Inline question ${question.questionText} saved with id ${id}`); });
            }
          });
        });
      }
    });
  }

  async syncUsersData() {
    const isValid = await this.authService.checkAcessTokenValidity();
    if (!isValid || !this.isDbInitialized || !navigator.onLine) {
      return;
    }
    await this.fetchProfile();
    await this.fetchProfilesByRole();
    await this.syncProfiles();
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
    return this.apiService.get(
      'accounts/bank-details',
      false,
      {userId: profileOnlineRef}
    ).subscribe((response: GetBankAccountsResponse) => {
      if (response.status === 200 && response.body.data.length > 0) {
        response.body.data.forEach((bankAccount) => {
          this.dbService.checkIfEntryExists('user_bank_accounts', bankAccount.appRef).then(async(exists) => {
            if (!exists) {
              const profile = await this.profilesDataService.getProfileByOnlineRef(bankAccount.user);
              if (profile?.id) {
                bankAccount.createdBy = bankAccount.createdBy ?? profile.id;
                bankAccount.updatedBy = bankAccount.updatedBy ?? profile.id;
                const data = Object.assign({}, bankAccount);
                delete data.id;
                const dataToSave = {...data, userId: profile.id, onlineRef: bankAccount.id};
                await this.paymentsDataService.createBankAccount(dataToSave).then(() => {});
              }
            }
          });
        });
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
        // update api record
      }
    }
  }

  async fetchBeneficiaries(profileOnlineRef) {
    return this.apiService.get(
      'accounts/beneficiaries-bank-details',
      false,
      {userId: profileOnlineRef}
    ).subscribe((response: GetBeneficiaryResponse) => {
      if (response.status === 200 && response.body.data.length > 0) {
        response.body.data.forEach((beneficiary) => {
          this.dbService.checkIfEntryExists('user_beneficiaries', beneficiary.appRef).then(async(exists) => {
            if (!exists) {
              const profile = await this.profilesDataService.getProfileByOnlineRef(beneficiary.user);
              if (profile?.id) {
                beneficiary.createdBy = beneficiary.createdBy ?? profile.id;
                beneficiary.updatedBy = beneficiary.updatedBy ?? profile.id;
                const data = Object.assign({}, beneficiary);
                delete data.id;
                const dataToSave = {...data, userId: profile.id, onlineRef: beneficiary.id};
                await this.paymentsDataService.createBeneficiary(dataToSave).then(() => {});
              }
            }
          });
        });
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
        // update api record
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
    return this.apiService.get('mydocuments').subscribe((response: any) => {
      if (response?.status === 200 && response.body.data.length > 0) {
        response.body.data.forEach(async(doc) => {
          this.dbService.checkIfEntryExists('documents', doc.appRef).then(async(exists) => {
            if (!exists) {
              await this.uploadService.fetchAndSaveFile(doc.fileUrl).then(async(fileUri) => {
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
              });
            }
          });
        });
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
    return this.apiService.get('passports').subscribe((response: any) => {
      if (response?.status === 200 && response.body.data.length > 0) {
        response.body.data.forEach(async(passport) => {
          await this.dbService.checkIfEntryExists('passports', passport.appRef).then(async(exists) => {
            if (!exists) {
              await this.uploadService.fetchAndSaveFile(passport.imageUrl).then(async(fileUri) => {
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
                  await this.documentsDataService.saveOnlinePassport(dataToSave).then(() => {});
                }
              });
            }
          });
        });
      }
    });
  }

  async fetchPayments() {
    return this.apiService.get('payments').subscribe((response: any) => {
      if (response?.status === 200 && response.body.length > 0) {
        response.body.forEach(async(payment) => {
          // const user = await this.sharedMethods.getUserData();
          const now = this.sharedMethods.getCurrentDateTime();
          const dataToSave = Object.assign({}, payment);
          delete dataToSave.id;
          dataToSave.userId = payment.user;
          dataToSave.vesselId = payment.vessel;
          dataToSave.onlineRef = payment.id;
          dataToSave.deductions = payment.deductions ? JSON.stringify(payment.deductions) : '';
          dataToSave.createdAt = payment.createdAt ??  now;
          dataToSave.updatedAt = payment.updatedAt ??  now;

          const paymentExists = await this.paymentsDataService.checkIfPaymentExists(payment.id);
          if (paymentExists) {
            const currentPayment = await this.paymentsDataService.payments.find(p => p.onlineRef === payment.id);
            const currentUpdateDate = new Date(currentPayment?.updatedAt);
            const newUpdateDate = new Date(payment.updatedAt);
            if (currentUpdateDate < newUpdateDate) {
              await this.paymentsDataService.update(dataToSave).then(() => {});
            }
          } else {
            await this.paymentsDataService.saveOnlinePayment(dataToSave).then(() => {});
          }
        });
      }
    });
  }

  async syncLearningHubProgress() {
    const isValid = await this.authService.checkAcessTokenValidity();
    if (!isValid  || !navigator.onLine) {
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
          if (currentUpdateDate > newUpdateDate) {
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
              const isOldPayslip = currentPayslipFilename && wage.payslip && wage.payslip.includes(currentPayslipFilename);
              if (wage?.payslip && !isOldPayslip) {
                const fileUri = await this.uploadService.fetchAndSaveFile(wage.payslip);
                wageToSave.payslip = fileUri ?? null;
              } else if (wage?.payslip && isOldPayslip) {
                wageToSave.payslip = currentWage.payslip;
              }
              
              const currentCrewBankTransferReceiptFilename = currentWage?.crewBankTransferReceipt ? currentWage.crewBankTransferReceipt.split('files/')[1] : null;
              const isOldCrewBankTransferReceipt = currentCrewBankTransferReceiptFilename && wage.crewBankTransferReceipt && wage.crewBankTransferReceipt.includes(currentCrewBankTransferReceiptFilename);
              if (wage?.crewBankTransferReceipt && !isOldCrewBankTransferReceipt) {
                const fileUri = await this.uploadService.fetchAndSaveFile(wage.crewBankTransferReceipt);
                wageToSave.crewBankTransferReceipt = fileUri ?? null;
              } else if (wage?.crewBankTransferReceipt && isOldCrewBankTransferReceipt) {
                wageToSave.crewBankTransferReceipt = currentWage.crewBankTransferReceipt;
              }
              
              const currentBeneficiaryBankTransferReceiptFilename = currentWage?.beneficiaryBankTransferReceipt ? currentWage.beneficiaryBankTransferReceipt.split('files/')[1] : null;
              const isOldBeneficiaryBankTransferReceipt = currentBeneficiaryBankTransferReceiptFilename && wage.beneficiaryBankTransferReceipt && wage.beneficiaryBankTransferReceipt.includes(currentBeneficiaryBankTransferReceiptFilename);
              if (wage?.beneficiaryBankTransferReceipt && !isOldBeneficiaryBankTransferReceipt) {
                const fileUri = await this.uploadService.fetchAndSaveFile(wage.beneficiaryBankTransferReceipt);
                wageToSave.beneficiaryBankTransferReceipt = fileUri ?? null;
              } else if (wage?.beneficiaryBankTransferReceipt && isOldBeneficiaryBankTransferReceipt) {
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
