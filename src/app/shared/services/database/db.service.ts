import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DBService {
  db: SQLiteObject;
  executedMigrations: any[] = [];
  allMigrationFiles: any[] = [];
  pendingMigrations: any[] = [];
  testEmails = [
    'taien+technology@50eight.com',
    'cici+technology@50eight.com',
    'farah+technology@50eight.com',
    'budi+technology@50eight.com',
    'tony+technology@50eight.com',
    'samsonkapeyi@50eight.com'
  ];;

  constructor(
    private sqlite: SQLite,
    public platform: Platform,
    public http: HttpClient
  ) {}
  checkDbPlatformAndRunMigration(seedData = false) {
    this.platform.ready().then(async() => {
      this.sqlite.create({
        name: 'tunalocal.db',
        location: 'default'
      }).then(async(_db: SQLiteObject) => {
          this.db = _db;
          await this.createMigrationsTable();
          this.executedMigrations = await this.readMigrationsTable();
          if (!seedData) {
            await this.getAndRunPendingMigrations();
            return;
          }
          await this.getAndRunPendingMigrations(seedData);
          })
      .catch(e => console.log(e));
    });
  }

  checkDBStatus() {
    this.sqlite.echoTest()
      .then(() => console.log('DB is ready'))
      .catch(e => console.log(e));
  }

  createMigrationsTable() {
    this.db.executeSql('CREATE TABLE IF NOT EXISTS migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, executed_at DATETIME)', [])
      .then(() => {})
      .catch(e => console.log('Migrations table already exists'));
  }

  readMigrationsTable() {
    console.log('Reading migrations table');
    return this.db.executeSql('SELECT * FROM migrations', [])
    .then((data) => {
      if (data.rows.length < 1) { console.log ('No migrations found'); }
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          this.executedMigrations.push(data.rows.item(i).name);
        }
      }
      return this.executedMigrations;
    });
  }

  async getAndRunPendingMigrations(seedData = false) {
    this.http.get('assets/migrations/migrations-list.txt', { responseType: 'text' as 'json'})
    .subscribe(async(data: any) => {
        this.allMigrationFiles = data.split('\n');
        // remove empty array elements
        delete this.allMigrationFiles[this.allMigrationFiles.length - 1];
        this.pendingMigrations = this.allMigrationFiles.filter(x => !this.executedMigrations.includes(x));
        if (!seedData) {
          this.pendingMigrations = this.pendingMigrations.filter(file => !file.includes('SeedData'));
        } else {
          this.pendingMigrations = this.pendingMigrations.filter(file => file.includes('SeedData'));
        }

        this.pendingMigrations.join('').split('');
        // TODO: remove this line. Left for testing purposes
        console.log('Pending migrations: ' + this.pendingMigrations);
        await this.runPendingMigrations(this.pendingMigrations);
    });
  }

  async runPendingMigrations(pendingMigrations) {
    pendingMigrations.forEach((migration) => {
      this.runSingleMigrationFile(migration);
    });
  }

  async runSingleMigrationFile(migrationFileName) {
    
    this.http.get('assets/migrations/' + migrationFileName, { responseType: 'text' as 'text'})
    .subscribe((data: any) => {
        // TODO: add logic for skipping comments in the migration file
        const migrationQueries = data.split(';');
        migrationQueries.forEach((query) => {
          query = query.replace(/\r?\n|\r/g, '');
          this.db.executeSql(query, [])
          .then(() => {
            // TODO: remove this line. Left for testing purposes
            console.log(`Query " ${query} " executed`);
          })
          .catch(e => {
            console.log(`Error executing query: ${query}`);
          });
        });
        this.db.executeSql('INSERT INTO migrations (name, executed_at) VALUES (?, ?)', [migrationFileName, new Date()])
        .then(() => console.log('Migration ' + migrationFileName + ' marked as completed'))
        .catch(e => console.log(e));
    });
  }

  dropDatabase() {
    this.sqlite.deleteDatabase({
      name: 'tunalocal.db',
      location: 'default'
    }).then(() => console.log('Database deleted'))
      .catch(e => console.log(e));
  }

  setAppRef(id, appRef, table) {
    const params = [appRef, id];
    const query = `UPDATE ${table} SET app_ref = ? WHERE id = ?`;
    this.db.executeSql(query, params).then(() => {
    }).catch((error) => {
      console.log(error);
    });
  }

  updateDatabaseField(table, field, value, appRef) {
    const params = [value, appRef];
    const query = `UPDATE ${table} SET ${field} = ? WHERE app_ref = ?`;
    this.db.executeSql(query, params).then(() => {
    }).catch((error) => {
      console.log(error);
    });
  }
}
