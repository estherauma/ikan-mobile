import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
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
    });
  }

  createDB() {
  this.sqlite.create({
    name: 'tunalocal.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
      db.executeSql('create table danceMoves(name VARCHAR(32))', [])
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
