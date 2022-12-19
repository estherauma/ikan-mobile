import { Injectable } from '@angular/core';
// Uncomment this when building for native device
import { SQLite,SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
// import { SQLiteObject } from './sqlite.mock';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class DBService {

  constructor(
    private sqlite: SQLite,
    public platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.createDB();
    });
  }

  createDB() {
    this.sqlite.create({
      name: 'tunalocal.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
        db.executeSql('create table migrations(name VARCHAR(32))', [])
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));
        })
      .catch(e => console.log(e));
  }

  checkDBStatus() {
    this.sqlite.echoTest()
      .then(() => console.log('DB is ready'))
      .catch(e => console.log(e));
  }

}
