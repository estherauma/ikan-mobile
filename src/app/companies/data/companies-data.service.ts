import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompaniesDataService {
  companies = new BehaviorSubject([]);
  db: SQLiteObject;

  constructor(
    public platform: Platform,
    public sqlite: SQLite,
  ) {
    this.platform.ready().then(async() => {
      this.sqlite.create({
        name: 'tunalocal.db',
        location: 'default'
      }).then(async(_db: SQLiteObject) => {
        this.db = _db;
        await this.retriveCompanies();
      }).catch(e => console.log(e));
    });
  }

  async retriveCompanies() {
    const query = 'SELECT * FROM companies';
    this.db.executeSql(query, []).then((data) => {
      const companies = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          companies.push({
            id: data.rows.item(i).id,
            appRef: data.rows.item(i).app_ref,
            onlineRef: data.rows.item(i).online_ref,
            name: data.rows.item(i).name,
            description: data.rows.item(i).description,
            status: data.rows.item(i).status,
            country: data.rows.item(i).country,
            telephone: data.rows.item(i).telephone,
            email: data.rows.item(i).email,
            addressLine1: data.rows.item(i).address_line_1,
            addressLine2: data.rows.item(i).address_line_2,
            addressLine3: data.rows.item(i).address_line_3,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
            imgUrl: 'assets/imgs/company.jpeg' // TODO: Update this to actualy company image once company image logic is done
          });
        }
      }
      this.companies.next(companies);
    }).catch((e) => console.log(e));
  }

  getAll() {
    return this.companies.asObservable();
  }

  async create(data) {
    const query = 'INSERT INTO companies (name, description, status, country, telephone, \
      email, address_line_1, address_line_2, address_line_3, created_at, updated_at, created_by, \
      updated_by, app_ref) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [data.name, data.description, data.status, data.country, data.telephone, data.email,
      data.address_line_1, data.address_line_2, data.address_line_3, data.created_at, data.updated_at,
      data.created_by, data.updated_by, data.app_ref];
    return this.db.executeSql(query, params).then((result) => {
      this.retriveCompanies();
      return result.insertId;
    }).catch((e) => console.log(e));
  }

  updateCompanyLogo(companyId, logoUrl) {}

  delete(id) {
    const query = 'DELETE FROM companies WHERE id = ?';
    const params = [id];
    return this.db.executeSql(query, params).then((result) => {
      this.retriveCompanies();
      // ToDo: Delete company related data from other tables
    }).catch((e) => console.log(e));
  }

  setAppRef(id, appRef) {
    const query = 'UPDATE companies SET app_ref = ? WHERE id = ?';
    const params = [appRef, id];
    return this.db.executeSql(query, params).then((result) => {
      // this.retriveCompanies();
    }).catch((e) => console.log(e));
  }
}
