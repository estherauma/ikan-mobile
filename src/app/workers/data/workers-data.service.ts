import { Injectable } from '@angular/core';
import {  SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { DBService } from 'src/app/shared/services/database/db.service';

@Injectable({
  providedIn: 'root'
})
export class WorkersDataService {
  db: SQLiteObject;
  workers = new BehaviorSubject([]);

  constructor(
      public platform: Platform,
      // public sqlite: SQLite,
      public dbService: DBService,
    ) {
      this.platform.ready().then(async() => {
      this.db = await this.dbService.configureDB();
    });

    this.dbService.isDBsetup().subscribe((res) => {
      if (res) {
        this.retrieveWorkers();
      }
    });
    }

  retrieveWorkers() {
    const query = 'SELECT * FROM workers';
    this.db.executeSql(query, []).then((data) => {
      const workers = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          workers.push({
            id: data.rows.item(i).id,
            fname: data.rows.item(i).f_name,
            lname: data.rows.item(i).l_name,
            profile_img_url: data.rows.item(i).profile_img_url,
            email: data.rows.item(i).email,
            phone: data.rows.item(i).phone,
            status: data.rows.item(i).status,
            addressLine1: data.rows.item(i).address_line_1,
            addressLine2: data.rows.item(i).address_line_2,
            addressLine3: data.rows.item(i).address_line_3,
            city: data.rows.item(i).city,
            country: data.rows.item(i).country,
            zipCode: data.rows.item(i).zip_code,
            inviteSent: data.rows.item(i).invite_sent,
            inviteAccepted: data.rows.item(i).invite_accepted,
            onlineRef: data.rows.item(i).online_ref,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }
      this.workers.next(workers);
    }).catch((e) => console.log(e));
  }

  getAll() {
    return this.workers.asObservable();
  }

  retrieveOne(id: Number) {
    const query = 'SELECT * FROM workers WHERE id = ?';
    return this.db.executeSql(query, [id]).then((data) => {
      let worker = {};
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          worker = {
            id: data.rows.item(i).id,
            fname: data.rows.item(i).f_name,
            lname: data.rows.item(i).l_name,
            email: data.rows.item(i).email,
            phone: data.rows.item(i).phone,
            status: data.rows.item(i).status,
            addressLine1: data.rows.item(i).address_line_1,
            addressLine2: data.rows.item(i).address_line_2,
            addressLine3: data.rows.item(i).address_line_3,
            city: data.rows.item(i).city,
            country: data.rows.item(i).country,
            zipCode: data.rows.item(i).zip_code,
            inviteSent: data.rows.item(i).invite_sent,
            inviteAccepted: data.rows.item(i).invite_accepted,
            onlineRef: data.rows.item(i).online_ref,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          };
        }
      }
      return worker;
    }).catch((e) => console.log(e));
  }

  create(data) {
    const query = 'INSERT INTO workers (f_name, l_name, profile_img_url, email, phone, \
      status, address_line_1, address_line_2, address_line_3, city, country, zip_code, created_at, updated_at, created_by, \
      updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [data.f_name, data.l_name, data.profile_img_url, data.email, data.phone,
      data.status, data.address_line_1, data.address_line_2, data.address_line_3,
      data.city, data.country, data.zip_code,  data.created_at, data.updated_at, data.created_by, data.updated_by];
    return this.db.executeSql(query, params).then((result) => {
      this.retrieveWorkers();
      return result.insertId;
    }).catch((e) => console.log(e));
  }

  update() {}


  delete() {}
}
