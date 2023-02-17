import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompaniesServiceService {
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
        this.retriveCompanies();
      }).catch(e => console.log(e));
    });
  }

  retriveCompanies() {
    throw new Error('Method not implemented.');
  }

  getAll() {
    return this.companies.asObservable();
  }

  async create(data) {
    const query = 'INSERT INTO companies (name, description, status, country, telephone, \
      email, address_line_1, address_line_2, address_line_3 created_at, updated_at, created_by, \
      updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [data.name, data.description, data. status, data.country, data.telephone, data.email,
      data.address_line_1, data.address_line_2, data.address_line_3, data.created_at, data.updated_at,
      data.created_by, data.updated_by];
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
}
