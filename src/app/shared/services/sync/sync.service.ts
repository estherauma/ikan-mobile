import { Injectable } from '@angular/core';
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
import { forkJoin } from 'rxjs';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';
import { AuthService } from '../auth/auth.service';
import { PaymentsDataService } from 'src/app/payments/data/payments-data.service';
import { StorageKeys, UserData, UserRole } from '../../types/api-types';
import { UploadService } from '../upload/upload.service';
import { DocumentsDataService } from 'src/app/mydocuments/data/documents-data.service';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  db: SQLiteObject;

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
  ) {
    this.platform.ready().then(async () => {
      this.sqlite.create({
        name: 'tunalocal.db',
        location: 'default'
      }).then(async (_db: SQLiteObject) => {
        this.db = _db;
      }).catch(e => console.log(e));
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
    if (!isValid) {
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
    await this.fetchCompanies();
    await this.fetchVessels();
    await this.fetchContracts(); // clauses are fetched after contracts have been fetched in the fetchContracts method
    await this.fetchMyDocuments();
    await this.fetchPassports();
    await this.fetchInlineQuestions();
    await this.fetchPayments();
  }

  async syncCompanies() {
    const companies = this.companyServ.companies;
    if (companies.length > 0) {
      companies.forEach(async(company) => {
        const companyId = company.id;
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
      });
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
              .then((id) => { console.log ( `Company ${company.name} saved with id ${id}`)});
            }
          });
        });
      }
    });
  }

  async syncVessels() {
    const vessels = this.vesselServ.vessels;
    if (vessels.length > 0) {
      vessels.forEach(async(vessel) => {
        const vesselId = vessel.id;
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
          this.apiService.put('vessels', vesselToUpload.onlineRef, vesselToUpload).subscribe(async(response) => {
            if (response?.['status'] === 'OK') {
              await this.postVesselImage(vessel, vesselToUpload.onlineRef);
            }
          });
        }
      });
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
        this.apiService.post('file-upload', imageData).subscribe((res) => {
          if (res?.['status'] === 'OK') {
            if (!vesselImage.onlineRef) {
              this.dbService.updateDatabaseField('vessel_images', 'online_ref', res?.['data']['vesselImage']?.id, vesselImage.app_ref);
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
          this.apiService.get('vessels-images').subscribe((response) => {
            if (response?.['status'] === 200 && response.body.length > 0) {
              response.body.forEach(async(image) => {
                const vessel = await this.vesselServ.getVesselByField('onlineRef', image.vessel);
                if (vessel && !vessel.imageFile.webPath) {
                  const vesselImage = await this.vesselServ.getVesselImageByVesselId(vessel.id);
                  if (!vesselImage) {
                    await this.uploadService.fetchAndSaveFile(image.imageUrl).then(async(fileUri) => {
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
    return this.contractServ.getAll().subscribe((data) => {
      let contracts  = data;
      if (contracts.length > 0) {
        contracts.forEach((contract) => {
          contract.startDate = new Date(contract.startDate).toISOString().split('T')[0];
          contract.endDate = new Date(contract.endDate).toISOString().split('T')[0];
          let tempContractId = contract.id;
          const contractToUpload = Object.assign({}, contract);
          delete contractToUpload.id;
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
            this.apiService.put('contracts', contractToUpload.onlineRef, contractToUpload).subscribe(async(response) => {
              if (response?.['status'] === 'OK') {
                await this.postContractDocument(contract);
                await this.syncContractClauses(contract.id, contract.onlineRef);
              }
            });
          }
        });
      }
    });
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
        this.apiService.post('file-upload', docData).subscribe((res) => {
          if (res?.['status'] === 'OK') {
            if (!contractDocument.onlineRef) {
              this.contractServ.updateContractDocumentFieldByContractId(contractDocument.contract_id, 'online_ref', res?.['data']['contractDocument']?.id);
            }
          } else {
            console.error(`Failed to sync contract document for contract ${contract.name} to the api`, res);
          }
        });
      }
    }
  }

  async fetchContracts() {
    return this.apiService.get('contracts').subscribe(async(response:GetContractsResponse) => {
      if (response.status === 200 && response.body.data.length > 0) {
        const userOnlineContracts = response.body.data.map((contract) => contract.appRef);
        await this.sharedMethods.saveDataToStorage(StorageKeys.currentUserOnlineContractsAppRefs, userOnlineContracts);
        
        forkJoin(response.body.data.map(async(contract) => {
          await this.dbService.checkIfEntryExists('contracts', contract.appRef)
          .then(async(exists) => {
            if (!exists) {
              await this.contractServ.saveOnlineContract(contract)
              .then((id) => { console.log ( `Contract ${contract.name} saved with id ${id}`)});
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
          const contract = this.contractServ.getContractByField('onlineRef', doc.contract);
          if (contract) {
            const contractDocument = await this.contractServ.getContractDocumentByField('contract_id', contract.id);
            if (!contractDocument) {
              await this.uploadService.fetchAndSaveFile(doc.url).then(async(fileUri) => {
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
              });
            }
          }
        });
      }
    });
  }

  async syncContractClauses(contractId, contractOnlineRef) {
    let clauses = await this.contractServ.retrieveContractClauses(contractId);
    clauses.forEach((clause) => {
      // The contract_id has to be the for the online record and not the local before sending to the api
      // replace the contract_id with the contract id online_ref
      clause.contract = contractOnlineRef;
      const clauseToUpload = Object.assign({}, clause);
      delete clauseToUpload.id;
      if (!clause.onlineRef) {
        this.apiService.post('contracts-clauses', clauseToUpload).subscribe(async(response: CreateContractClauseResp) => {
          if (response?.status === 'OK') {
            this.dbService.updateDatabaseField('contract_clauses', 'online_ref', response?.data?.id, clause.appRef);
            await this.syncContractClausesAttachments(clause);
          }
        });
      } else {
        this.apiService.put('contracts-clauses', clause.onlineRef, clauseToUpload).subscribe(async(response) => {
          if (response?.['status'] === 'OK') {
            await this.syncContractClausesAttachments(clause);
          } else {
            console.error('Failed to update contract clause', response);
          }
        });
      }
    });
  }

  async syncContractClausesAttachments(clause) {
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
              this.apiService.post('file-upload', attachmentData).subscribe((res) => {
                if (res?.['status'] !== 'OK')  {
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
    return this.apiService.get('contracts-clauses').subscribe((response:GetClausesResponse) => {
      if (response.status === 200 && response.body.length > 0) {
        response.body.forEach(async(clause) => {
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
                  let content = JSON.parse(clause.content);
                  if (Object.keys(content).length && (content.partyASignature || content.partyBSignature)) {
                    for (const [key, value] of Object.entries(content)) {
                      if (key === 'partyASignature' || key === 'partyBSignature') {
                        await this.uploadService.fetchAndSaveFile(value).then(async(fileUri) => {
                          content[key] = fileUri;
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
            }
          });
        });
      }
    });
  }

  async syncSurveyResponses() {
    return this.surveyDataService.getAll().subscribe((surveys) => {
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
           this.apiService.post('surveys', surveyToUpload).subscribe(async(response:CreateSurveyResp) => {
            if (response?.status === 'OK') {
              await this.surveyDataService.delete(surveyId);
            }
          }, e => console.error(e));
        });
      }
    });
  }

  async syncInlineQuestions() {
    return this.surveyDataService.getAllInlineQuestions().subscribe((questions) => {
      if (questions?.length) {
        questions.forEach((question) => {
          const questionId = question.id;
          const questionToUpload = Object.assign({}, question);
          delete questionToUpload.id;
          questionToUpload.user = questionToUpload.userId;
          if (!questionToUpload.onlineRef) {
            this.apiService.post('inline-questions', questionToUpload).subscribe(async(response) => {
              if (response['status'] === 'OK') {
                this.dbService.updateDatabaseField('inline_questions', 'online_ref', response['data']['id'], question.appRef);
              }
            });
          } else {
            this.apiService.put('inline-questions', questionToUpload.onlineRef, questionToUpload).subscribe(async(response) => {
              if (response?.['status'] !== 'OK') {
                console.error('Failed to update inline question', response);
              }
            });
          }
        });
      }
    });
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
              .then((id) => { console.log ( `Inline question ${question.questionText} saved with id ${id}`)});
            }
          });
        });
      }
    });
  }

  async syncUsersData() {
    await this.fetchProfile();
    await this.fetchProfilesByRole();
    await this.syncProfiles();
  }

  // fetches current user's profile only
  async fetchProfile() {
    return this.apiService.get('accounts/profile').subscribe(async(response: GetProfileResponse) => {
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
          await this.profilesDataService.saveOnlineProfile(dataToSave).then(async(id) => {
            if (dataToSave?.profileImage) {
              await this.uploadService.fetchAndSaveFile(dataToSave.profileImage).then(async(fileUri) => {
                await this.profilesDataService.updateProfilesField(dataToSave.email, 'profile_image', fileUri);
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
            await this.profilesDataService.update(dataToSave).then(async(id) => {
              if (dataToSave?.profileImage) {
                await this.uploadService.fetchAndSaveFile(dataToSave.profileImage).then(async(fileUri) => {
                  await this.profilesDataService.updateProfilesField(dataToSave.email, 'profile_image', fileUri);
                });
              }
              await this.fetchBankAccounts(dataToSave.id);
              await this.fetchBeneficiaries(dataToSave.id);
            });
          }
        }
      }
    });
  }

  // fetches profiles by role
  async fetchProfilesByRole() {
    const roles = await this.getRolesToFetch();
    if (roles?.length) {
      roles.forEach(async(role) => {
        return this.apiService.get('accounts/users', false, {role}).subscribe(async(response: GetUsersResponse) => {
          if (response.status === 200 && response.body.data.length > 0) {
            response.body.data.forEach(async(profile) => {
              const user: UserData = await this.sharedMethods.getUserData();
              const now = this.sharedMethods.getCurrentDateTime();
              const role = profile?.roles?.length ? profile?.roles.join(',') : '';
              const dataToSave = {...profile, userRole: role};
              dataToSave.createdAt = dataToSave.createdAt ??  now;
              dataToSave.updatedAt = dataToSave.updatedAt ??  now;
              dataToSave.createdBy = dataToSave.createdBy ?? user?.id;
              dataToSave.updatedBy = dataToSave.updatedBy ?? user?.id;
              const profileExists = await this.profilesDataService.checkIfProfileExists(dataToSave.email);
              if (!profileExists) {
                await this.profilesDataService.saveOnlineProfile(dataToSave).then(async(id) => {
                  if (dataToSave?.profileImage) {
                    await this.uploadService.fetchAndSaveFile(dataToSave.profileImage).then(async(fileUri) => {
                      await this.profilesDataService.updateProfilesField(dataToSave.email, 'profile_image', fileUri);
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
                  await this.profilesDataService.update(dataToSave).then(async(id) => {
                    if (dataToSave?.profileImage) {
                      await this.uploadService.fetchAndSaveFile(dataToSave.profileImage).then(async(fileUri) => {
                        await this.profilesDataService.updateProfilesField(dataToSave.email, 'profile_image', fileUri);
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
        return [ UserRole.worker, UserRole.taiwaneseAgent, UserRole.indonesianAgent]
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
        return this.apiService.post('accounts/profile', profileToUpload, false, {user_id: profile?.onlineRef}).subscribe(async(response: CreateProfileResponse) => {
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
        return this.apiService.post('accounts/profile', profileToRegister, false, {register: 'register'}).subscribe(async(response: CreateProfileResponse) => {
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
      this.apiService.post('file-upload', imageData).subscribe((res) => {
        if (res?.['status'] !== 'OK') {
          console.error(`Failed to sync profile image for user ${profile.email} to the api`, res);
        }
      });
    }
  }

  async fetchBankAccounts(profileOnlineRef) {
    return this.apiService.get('accounts/bank-details', false, {user_id: profileOnlineRef}).subscribe((response: GetBankAccountsResponse) => {
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
    accounts.forEach(async(account) => {
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
    });
  }

  async fetchBeneficiaries(profileOnlineRef) {
    return this.apiService.get('accounts/beneficiaries-bank-details', false, {user_id: profileOnlineRef}).subscribe((response: GetBeneficiaryResponse) => {
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
    beneficiaries.forEach(async(beneficiary) => {
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
    });
  }

  async syncMyDocuments() {
    return this.documentsDataService.retrieveAllObservable().subscribe((documents) => {
      if (documents?.length) {
        documents.forEach(async(document) => {
          if (document.isDeleted && !document.onlineRef) {
            await this.documentsDataService.deleteDocument(document.id);
          } else if (document.isDeleted && document.onlineRef) {
            this.apiService.delete('mydocuments', document.onlineRef).subscribe(async(response) => {
              if (response?.['status'] === 'OK' || !response) {
                await this.documentsDataService.deleteDocument(document.id);
              } else {
                console.error(`Failed to delete document ${document.fileName} from the api`, response);
              }
            });
          } else {
            const documentId = document.id;
            const documentToUpload = Object.assign({}, document);
            delete documentToUpload.id;
            delete documentToUpload.fileUrl;

            const file = await this.uploadService.retrieveAndReturnBlob(document.fileUrl);
            if (file) {
              const docData =  new FormData();
              docData.append('fileContent', file);
              docData.append('entityType', 'my_document');
              this.apiService.post('file-upload', docData).subscribe((uploadResponse) => {
                if (uploadResponse?.['status'] === 'OK') {
                  documentToUpload.fileUrl = uploadResponse?.['data']?.fileLocation;
                  const dataToSave = {...documentToUpload, user: documentToUpload.userId};
                  
                  if (!documentToUpload.onlineRef) {
                    this.apiService.post('mydocuments', dataToSave).subscribe((response) => {
                      if (response?.['status'] === 'OK') {
                        this.dbService.updateDatabaseField('documents', 'online_ref', response?.['data']?.id, documentToUpload.appRef);
                      } else {
                        console.error(`Failed to sync document ${document.fileName} to the api`, response);
                      }
                    });
                  } else {
                    this.apiService.put('mydocuments', documentToUpload.onlineRef, dataToSave).subscribe((response) => {
                      if (response?.['status'] !== 'OK')  {
                        console.error(`Failed to sync document ${document.fileName} to the api`, response);
                      }
                    });
                  }
                } else {
                  console.error(`Failed to sync document ${document.fileName} to the api`, uploadResponse);
                }
              });
            }
          }
        });
        
      }
    });
  }

  async fetchMyDocuments() {
    return this.apiService.get('mydocuments').subscribe((response) => {
      if (response?.['status'] === 200 && response.body.data.length > 0) {
        response.body.data.forEach(async(doc) => {
          this.dbService.checkIfEntryExists('documents', doc.appRef).then(async(exists) => {
            if (!exists) {
              await this.uploadService.fetchAndSaveFile(doc.fileUrl).then(async(fileUri) => {
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
              });
            }
          });
        });
      }
    });
  }

  async syncPassports(){
    await this.documentsDataService.retrievePassports(true).then((passports) => {
      if (passports.length > 0) {
        passports.forEach(async(passport) => {
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
              this.apiService.post('passports', dataToSave).subscribe(async(response) => {
                if (response?.['status'] === 'OK') {
                  this.dbService.updateDatabaseField('passports', 'online_ref', response?.['data']?.id, passport.appRef);
                  const file = await this.uploadService.retrieveAndReturnBlob(passport.imageUrl); 
                  if (file) {
                    const imageData = new FormData();
                    imageData.append('fileContent', file);
                    imageData.append('entityType', 'passport');
                    imageData.append('passportId', response?.['data']?.id);

                    this.apiService.post('file-upload', imageData).subscribe((res) => {
                      if (res?.['status'] !== 'OK') {
                        console.error(`Failed to sync passport image, ${passport.appRef} to the api`, res);
                      }
                    });
                  };
                }
              });
            }
          } else {
            if (passport.isDeleted) {
              this.apiService.delete('passports', passport.onlineRef).subscribe(async(response) => {
                if (response?.['status'] === 'OK' || !response) {
                  await this.documentsDataService.deletePassport(passport.id);
                } else {
                  console.error(`Failed to delete passport ${passport.appRef} from the api`, response);
                }
              });
            } else {
              this.apiService.put('passports', passport.onlineRef, dataToSave).subscribe(async(response) => {
                if (response?.['status'] === 'OK') {
                  const file = await this.uploadService.retrieveAndReturnBlob(passport.imageUrl);
                  if (file) {
                    const imageData = new FormData();
                    imageData.append('fileContent', file);
                    imageData.append('entityType', 'passport');
                    imageData.append('passportId', passport.onlineRef);
                    this.apiService.post('file-upload', imageData).subscribe((res) => {
                      if (res?.['status'] !== 'OK') {
                        console.error(`Failed to sync passport image, ${passport.appRef} to the api`, res);
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    });
  }

  async fetchPassports() {
    return this.apiService.get('passports').subscribe((response) => {
      if (response?.['status'] === 200 && response.body.data.length > 0) {
        response.body.data.forEach(async(passport) => {
          await this.dbService.checkIfEntryExists('passports', passport.appRef).then(async(exists) => {
            if (!exists) {
              await this.uploadService.fetchAndSaveFile(passport.imageUrl).then(async(fileUri) => {
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
              });
            }
          });
        });
      }
    });
  }

  async fetchPayments() {
    return this.apiService.get('payments').subscribe((response) => {
      if (response?.['status'] === 200 && response.body.length > 0) {
        response.body.forEach(async(payment) => {
          const user = await this.sharedMethods.getUserData();
          const now = this.sharedMethods.getCurrentDateTime();
          const dataToSave = Object.assign({}, payment);
          delete dataToSave.id;
          dataToSave.userId = payment.user;
          dataToSave.vesselId = payment.vessel;
          dataToSave.onlineRef = payment.id;

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
}
