import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DemandlettersDataService {
  db: SQLiteObject;
  demandLetters = new BehaviorSubject([]);

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
        this.retrieveDemandletters();
      }).catch(e => console.log(e));
    });
  }

  retrieveDemandletters() {
    const query = 'SELECT * FROM demand_letters';
    this.db.executeSql(query, []).then((data) => {
      const demandletters = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          demandletters.push({
            id: data.rows.item(i).id,
            name: data.rows.item(i).name,
            appRef: data.rows.item(i).app_ref,
            internalRef: data.rows.item(i).internal_ref,
            dateOpened: data.rows.item(i).date_opened,
            status: data.rows.item(i).status,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by
          });
        }
      }
      this.demandLetters.next(demandletters);
    }).catch((e) => console.log(e));
  }

  getAll() {
    return this.demandLetters.asObservable();
  }

  async create(data) {
    const query = 'INSERT INTO demand_letters (name, app_ref, internal_ref, \
      date_opened, status, created_at, updated_at, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [data.name, data.app_ref, data.app_ref, data.date_opened,
      data.status, data.created_at, data.updated_at, data.created_by, data.updated_by];
    return this.db.executeSql(query, params).then((result) => {
      this.retrieveDemandletters();
      return result.insertId;
    }).catch((e) => console.log(e));
  }

  update(data) {}

  delete(id) {
    const query = 'DELETE FROM demand_letters WHERE id = ?';
    const params = [id];

    return this.db.executeSql(query, params).then((result) => {
      this.retrieveDemandletters();
      // TODO: Delete all other details related to this demandletter
    });
  }


}
