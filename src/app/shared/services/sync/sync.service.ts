import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { DBService } from '../database/db.service';
import { CompaniesDataService } from 'src/app/companies/data/companies-data.service';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { CreateCompanyResp, CreateContractClauseResp, CreateContractResp, CreateSurveyResp, CreateVesselResp, GetClausesResponse, GetCompaniesResponse, GetContractsResponse, GetProfileResponse } from './types';
import { VesselsDataService } from 'src/app/vessels/data/vessels-data.service';
import { ContractDataService } from 'src/app/contracts/data/contract-data.service';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';
import { SurveyDataService } from 'src/app/survey/data/survey-data.service';
import { forkJoin } from 'rxjs';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';

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
    this.syncCompanies();
    this.syncVessels();
    this.syncContracts();
    this.syncSurveyResponses();
    this.fetchProfile();
    this.fetchCompanies();
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
              const now = this.sharedMethods.getCurrentDateTime();
              const user = await this.sharedMethods.getUserData();
              contract.updatedAt = contract.updatedAt ??  now;
              contract.updatedBy = contract.updatedBy ?? user?.id;
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
              const now = this.sharedMethods.getCurrentDateTime();
              const user = await this.sharedMethods.getUserData();
              clause.updatedAt = clause.updatedAt ?? now;
              clause.updatedBy = clause.updatedBy ?? user?.id;
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

  syncProfile() {}

  fetchProfile() {
    this.apiService.get('accounts/profile').subscribe(async(response: GetProfileResponse) => {
      if (response.status === 200 && response.body.data) {
        const user = await this.sharedMethods.getUserData();
        const now = this.sharedMethods.getCurrentDateTime();
        const dataToSave = {...response.body.data, userRole: user.role};
        dataToSave.createdAt = dataToSave.updatedAt ??  now;
        dataToSave.updatedAt = dataToSave.updatedAt ??  now;
        dataToSave.createdBy = dataToSave.updatedBy ?? user?.id;
        dataToSave.updatedBy = dataToSave.updatedBy ?? user?.id;
        const profileExists = await this.profilesDataService.checkIfProfileExists(dataToSave.email);
        if (!profileExists) {
          this.profilesDataService.create(dataToSave)
          .then((id) => { console.log ( `Profile ${dataToSave.email} saved with id ${id}`)})
          .catch((e) => console.error(e));
        } else {
          const currentProfile = await this.profilesDataService.getSingleProfile(dataToSave.email);
          const currentDate = new Date(currentProfile?.updatedAt);
          const newDate = new Date(dataToSave?.updatedAt);
          if (currentDate < newDate) {
            this.profilesDataService.update(dataToSave)
            .then((id) => { console.log ( `Profile ${dataToSave.email} updated.`)});
          }
        }

      }
    });
  }

  syncUsersProfiles() {}
  fetchUsersProfiles() {}
}
