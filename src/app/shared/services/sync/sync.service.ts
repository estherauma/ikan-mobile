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
  ProfileSyncData,
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
import { UserData, UserRole } from '../../types/api-types';

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

    this.apiService.setApiRequestHeaders();
    this.syncUsersData();
    this.syncCompanies();
    this.syncVessels();
    this.syncContracts();
    this.syncSurveyResponses();
    this.fetchCompanies();
    this.fetchVessels();
    this.fetchContracts(); // clauses are fetched after contracts have been fetched in the fetchContracts method
  }

  syncCompanies() {
    this.companyServ.getAll().subscribe((data) => {
      let companies = data;
      if (companies.length > 0) {
        companies.forEach((company) => {
          if (!company.onlineRef) {
            this.apiService.post('companies', company).subscribe((response: CreateCompanyResp) => {
              if (response?.status === 'OK') {
                this.updateEntityOnlineId(response?.data?.id, company.appRef, 'companies');
              }
            });
          } else {
            // this.apiService.put('companies', company.online_ref, company).subscribe((response) => {
            //   console.log(response);
            // });
          }
        });
      }
    })
  }

  fetchCompanies() {
    this.apiService.get('companies').subscribe((response: GetCompaniesResponse) => {
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

  syncVessels() {
    this.vesselServ.getAll().subscribe((data) => {
      let vessels = data;
      if (vessels.length > 0) {
        vessels.forEach((vessel) => {
          if (!vessel.onlineRef) {
            this.apiService.post('vessels', vessel).subscribe((response: CreateVesselResp) => {
              if (response?.status === 'OK') {
                this.dbService.updateDatabaseField('vessels', 'online_ref', response?.data?.id, vessel.appRef);
              }
            });
          } else {
            // this.apiService.put('vessels', vessel.online_ref, vessel).subscribe((response) => {
            //   console.log(response);
            // });
          }
        });
      }
    });
  }

  fetchVessels() {
    this.apiService.get('vessels').subscribe((response: GetVesselsResponse) => {
      if (response.status === 200 && response.body.data.length > 0) {
        response.body.data.forEach((vessel) => {
          this.dbService.checkIfEntryExists('vessels', vessel.appRef)
          .then((exists) => {
            if (!exists) {
              this.vesselServ.saveOnlineVessel(vessel)
              .then((id) => { console.log ( `Vessel ${vessel.name} saved with id ${id}`)});
            }
          });
        });
      }
    });
  }

  syncContracts() {
    this.contractServ.getAll().subscribe((data) => {
      let contracts  = data;
      if (contracts.length > 0) {
        contracts.forEach((contract) => {
          contract.startDate = new Date(contract.startDate).toISOString().split('T')[0];
          contract.endDate = new Date(contract.endDate).toISOString().split('T')[0];
          if (!contract.onlineRef) {
            let tempContractId = contract.id;
            // delete contract.id;
            this.apiService.post('contracts', contract).subscribe((response: CreateContractResp) => {
              if (response?.status === 'OK') {
                contract.id = tempContractId;
                this.dbService.updateDatabaseField('contracts', 'online_ref', response?.data?.id, contract.appRef);
                // start syncing the clauses at this point. 
                // we'd avoid making a different db call to get th online_ref
                this.syncContractClauses(tempContractId, response?.data?.id);
                
              }
            });
          } else {
            // if the contracts are synced, we want to update the contract or sync the clauses
            // you can't sync  the clauses without the contract online_ref
            this.syncContractClauses(contract.id, contract.onlineRef);
            // this.apiService.put('contracts', contract.online_ref, contract).subscribe((response) => {
            //   console.log(response);
            // });
          }
        });
      }
    });
  }

  async fetchContracts() {
    return this.apiService.get('contracts').subscribe(async(response:GetContractsResponse) => {
      if (response.status === 200 && response.body.data.length > 0) {
        forkJoin(response.body.data.map(async(contract) => {
          await this.dbService.checkIfEntryExists('contracts', contract.appRef)
          .then(async(exists) => {
            if (!exists) {
              this.contractServ.saveOnlineContract(contract)
              .then((id) => { console.log ( `Contract ${contract.name} saved with id ${id}`)});
            }
          });
        })).subscribe(() => {
          // fetch the contract clauses after the contracts have been fetched
          this.fetchContractClauses();
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
      if (!clause.onlineRef) {
        this.apiService.post('contracts/clauses', clause).subscribe((response: CreateContractClauseResp) => {
          if (response?.status === 'OK') {
            this.dbService.updateDatabaseField('contract_clauses', 'online_ref', response?.data?.id, clause.appRef);
          }
        });
      } else {
        // this.apiService.put('contract-clauses', clause.online_ref, clause).subscribe((response) => {
        //   console.log(response);
        // });
      }
    });
  }

  async fetchContractClauses() {
    return this.apiService.get('contracts/clauses').subscribe((response:GetClausesResponse) => {
      if (response.status === 200 && response.body.length > 0) {
        response.body.forEach((clause) => {
          this.dbService.checkIfEntryExists('contract_clauses', clause.appRef)
          .then(async(exists) => {
            if (!exists) {
              const contract = this.contractServ.getContractByField('onlineRef', clause.contract);
              if (contract) {
                this.contractServ.saveOnlineContractClause(contract?.id, clause)
                .then((id) => { console.log ( `Contract clause ${clause.name} saved with id ${id}`)});
              }
            }
          });
        });
      }
    });
  }

  async syncSurveyResponses() {
    this.surveyDataService.getAll().subscribe((surveys) => {
      if (surveys?.length) {
        surveys.forEach((survey) => {
          delete survey.id;
          if (!survey.onlineRef) {
            this.apiService.post('surveys', survey).subscribe((response:CreateSurveyResp) => {
              if (response?.status === 'OK') {
                this.dbService.updateDatabaseField('surveys', 'online_ref', response?.data.id, survey.appRef);
              }
            }, e => console.error(e));
          } else {
            // TODO: add update logic
          }
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
        return this.apiService.post('accounts/profile', profileToUpload, false, {user_id: profile?.onlineRef}).subscribe(async(response: CreateProfileResponse) => {
          if (response?.status === 'OK') {
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
        return this.apiService.post('accounts/profile', profileToRegister, false, {register: 'register'}).subscribe(async(response: CreateProfileResponse) => {
          if (response?.status === 'OK') {
            await this.profilesDataService.updateProfileOnlineRef(profile.email, response?.data?.id);
            await this.syncBankAccounts(profileId, response?.data?.id);
            await this.syncBeneficiaries(profileId, response?.data?.id);
          } else { 
            console.error(`Failed to sync/register profile ${profile.email} to the api`, response);
          }
        });
      }
    });
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

}
