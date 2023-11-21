import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { DBService } from '../database/db.service';
import { CompaniesDataService } from 'src/app/companies/data/companies-data.service';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { CreateCompanyResp, CreateVesselResp } from './types';
import { VesselsDataService } from 'src/app/vessels/data/vessels-data.service';

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
    private dbService: DBService
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

}
