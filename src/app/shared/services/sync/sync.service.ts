import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { DBService } from '../database/db.service';
import { CompaniesDataService } from 'src/app/companies/data/companies-data.service';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { CreateCompanyResp, CreateContractClauseResp, CreateContractResp, CreateVesselResp } from './types';
import { VesselsDataService } from 'src/app/vessels/data/vessels-data.service';
import { ContractDataService } from 'src/app/contracts/data/contract-data.service';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';
import { SurveyDataService } from 'src/app/survey/data/survey-data.service';

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
  ) { 
    this.platform.ready().then(async() => {
      this.sqlite.create({
        name: 'tunalocal.db',
        location: 'default'
      }).then(async(_db: SQLiteObject) => {
        this.db = _db;
      }).catch(e => console.log(e));
    });
  }

  updateEntityOnlineId(onlineId: string, appRef: string, table: string) {
    const params = [ onlineId, appRef ];
    const query = `UPDATE ${table} SET online_ref = ? WHERE app_ref = ?`;
    this.db.executeSql(query, params).then(() => {
    }).catch((error) => {
      console.log(error);
    });
  }

  syncData() {
    this.syncCompanies();
    this.syncVessels();
    this.syncContracts();
    this.syncSurveyResponses();
  }

  syncCompanies() { 
    this.companyServ.getAll().subscribe((data) => {
      let companies = data;
      if (companies.length > 0) {
        companies.forEach((company) => {
          delete company.id;
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

  syncVessels() {
    this.vesselServ.getAll().subscribe((data) => {
      let vessels = data;
      if (vessels.length > 0) {
        vessels.forEach((vessel) => {
          delete vessel.id;
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
            delete contract.id;
            this.apiService.post('contracts', contract).subscribe((response: CreateContractResp) => {
              if (response?.status === 'OK') {
                this.dbService.updateDatabaseField('contracts', 'online_ref', response?.data?.id, contract.appRef);
                // start syncing the clauses at this point. 
                // we'd avoid making a different db call to get th online_ref
                this.syncContractClauses(contract.id, response?.data?.id);
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

  async syncContractClauses(contractId, contractOnlineRef) {
    let clauses = await this.contractServ.retrieveContractClauses(contractId);
    clauses.forEach((clause) => {
      delete clause.id;
      // The contract_id has to be the for the online record and not the local before sending to the api
      // replace the contract_id with the contract id online_ref
      clause.contract = contractOnlineRef;
      if (!clause.onlineRef) {
        console.log(clause);
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

  async syncSurveyResponses() {
    this.surveyDataService.getAll().subscribe((surveys) => {
      if (surveys?.length) {
        surveys.forEach((survey) => {
          delete survey.id;
          if (!survey.onlineRef) {
            this.apiService.post('surveys', survey).subscribe((response) => {
              if (response['status'] === 'OK') {
                this.dbService.updateDatabaseField('surveys', 'online_ref', response['data'].id, survey.appRef);
              }
            }, e => console.error(e));
          } else {
            // TODO: add update logic
          }
        });
      }
    });
  }
}
