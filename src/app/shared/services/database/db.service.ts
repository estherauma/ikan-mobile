import { Injectable } from '@angular/core';
// Uncomment this when building for native device
// import { SQLite,SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { SQLiteObject } from './sqlite.mock';
import { Platform } from '@ionic/angular';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { HttpClient } from '@angular/common/http';
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
    public http: HttpClient
  ) {
    this.platform.ready().then(async () => {
      await this.createDB();
      await this.createMigrationsTable();
      await this.readMigrationsTable();
      await this.getAndRunPendingMigrations();
    });
  }

  createDB() {
    this.sqlite.create({
      name: 'tunalocal.db',
      location: 'default'
    }).then((_db: SQLiteObject) => {
        this.db = _db;
        console.log('Database created');
        })
      .catch(e => console.log(e));
  }

  checkDBStatus() {
    this.sqlite.echoTest()
      .then(() => console.log('DB is ready'))
      .catch(e => console.log(e));
  }

  createMigrationsTable() {
    this.db.executeSql('CREATE TABLE IF NOT EXISTS migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, executed_at DATETIME)', [])
      .then(() => console.log('Created migrations table'))
      .catch(e => console.log('Migrations table already exists'));
  }

  readMigrationsTable() {
    console.log('Reading migrations table');
    this.db.executeSql('SELECT * FROM migrations', [])
    .then((data) => {
      if (data.rows.length < 1) { console.log ('No migrations found'); }
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          console.log('Migrations: ', data.rows.item(i));
          this.executedMigrations.push(data.rows.item(i).name);
        }
      }
    });
  }

  async getAndRunPendingMigrations() {
    this.http.get('assets/migrations/migrations-list.txt', { responseType: 'text' as 'json'})
    .subscribe(async (data: any) => {
        this.allMigrationFiles = data.split('\n');
        // remove empty array elements
        delete this.allMigrationFiles[this.allMigrationFiles.length - 1];
        this.pendingMigrations = this.allMigrationFiles.filter(x => !this.executedMigrations.includes(x));
        this.pendingMigrations.join('').split('');
        await this.runPendingMigrations(this.pendingMigrations);
        // remove empty array elements

    });
  }

  async runPendingMigrations(pendingMigrations) {
    pendingMigrations.forEach((migration) => {
      this.runSingleMigration(migration);
    });
  }

  async runSingleMigration(migrationFileName) {
    console.log('Processing migrations file: ' + migrationFileName);
    this.http.get('assets/migrations/' + migrationFileName, { responseType: 'text' as 'json'})
    .subscribe((data: any) => {
        const migrationQueries = data.split(';');
        console.log('Migration queries: ', migrationQueries);
        migrationQueries.forEach((query) => {
          this.db.executeSql(query, [])
          .then(() => {
            console.log('Migration ' + migrationFileName + ' executed');
            this.db.executeSql('INSERT INTO migrations (name, executed_at) VALUES (?, ?)', [migrationFileName, new Date()])
            .then(() => console.log('Migration ' + migrationFileName + ' added to migrations table'))
            .catch(e => console.log(e));
          })
          .catch(e => console.log(e));
        });
    });
  }


  dropDatabase() {
    this.sqlite.deleteDatabase({
      name: 'tunalocal.db',
      location: 'default'
    }).then(() => console.log('Database deleted'))
      .catch(e => console.log(e));
  }

}
