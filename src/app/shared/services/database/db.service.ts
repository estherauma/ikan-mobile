import { Injectable } from '@angular/core';
// Uncomment this when building for native device
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { SQLiteObject } from './sqlite.mock';
import { Platform } from '@ionic/angular';
import { File } from '@awesome-cordova-plugins/file/ngx';
@Injectable({
  providedIn: 'root'
})
export class DBService {
  db: SQLiteObject;
  executedMigrations: any[] = [];
  allMigrationFiles: any[] = [];
  pendingMigrations: any[] = [];

  constructor(
    private sqlite: SQLite,
    public platform: Platform,
    public file: File
  ) {
    this.platform.ready().then(() => {
      this.createDB();
    });
  }

  createDB() {
    this.sqlite.create({
      name: 'tunalocal.db',
      location: 'default'
    }).then((_db: SQLiteObject) => {
        this.db = _db;
        })
      .catch(e => console.log(e));
  }

  checkDBStatus() {
    this.sqlite.echoTest()
      .then(() => console.log('DB is ready'))
      .catch(e => console.log(e));
  }

  readMigrationsTable() {
    this.db.executeSql('SELECT * FROM migrations ORDER BY id ASC', [])
    .then((data) => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          console.log('Migrations: ', data.rows.item(i));
          this.executedMigrations.push(data.rows.item(i).name);
        }
      }
    })
    .catch((e) => {
      // TODO: Write to the log file
      // We'll create a service that'll handle the migrations
    });
  }

  readMigrationsFiles() {
    // read files from migrations folder


  }

  getPendingMigrations() {}

  runMigration() {}

  dropDatabase() {
    this.sqlite.deleteDatabase({
      name: 'tunalocal.db',
      location: 'default'
    }).then(() => console.log('Database deleted'))
      .catch(e => console.log(e));
  }

}
