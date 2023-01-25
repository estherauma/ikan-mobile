import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class WorkordersDataService {
  db: SQLiteObject;

  constructor(
    public platform: Platform,
    public sqlite: SQLite
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

  getAll() {}

  create(data) {}

  getOne(id) {}

  delete(id) {}

  update(id, workOrderData) {}
}
