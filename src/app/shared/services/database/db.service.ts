import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error-handler/global-error-handler.service';

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
    public http: HttpClient,
    public globalErrorHandler: GlobalErrorHandlerService,
  ) {}
  
  async checkDbPlatformAndRunMigration(seedData = false) {
    await this.platform.ready().then(async() => {
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
        .catch(e => {
          this.globalErrorHandler.handleError(e, 'Error in db.service.ts at checkDbPlatformAndRunMigration(). Error creating database or running migrations');
        });
    });
  }

  checkDBStatus() {
    this.sqlite.echoTest()
      .then(() => console.log('DB is ready'))
      .catch(e => {
        this.globalErrorHandler.handleError(e, 'Error in db.service.ts at checkDBStatus(). Error checking database status');
      });
  }

  async createMigrationsTable() {
    return this.db.executeSql('CREATE TABLE IF NOT EXISTS migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, executed_at DATETIME)', [])
      .then(() => {})
      .catch(e => {
        this.globalErrorHandler.handleError(e, 'Error in db.service.ts at createMigrationsTable(). Error creating migrations table or table already exists');
      });
  }

  async readMigrationsTable() {
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
    }).catch(e => {
      this.globalErrorHandler.handleError(e, 'Error in db.service.ts at readMigrationsTable(). Error reading migrations table');
      return [];
    });
  }

  async getAndRunPendingMigrations(seedData = false) {
    return this.http.get('assets/migrations/migrations-list.txt', { responseType: 'text' as 'json'})
    .subscribe(async(data: any) => {
        this.allMigrationFiles = (data as string)?.split('\n') || [];
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
    return pendingMigrations.forEach(async(migration) => {
      await this.runSingleMigrationFile(migration);
    });
  }

  async runSingleMigrationFile(migrationFileName) {
    
    return this.http.get('assets/migrations/' + migrationFileName, { responseType: 'text' as 'text'})
    .subscribe(async(data: any) => {
        // TODO: add logic for skipping comments in the migration file
        const migrationQueries = data.split(';');
        await migrationQueries.forEach(async(query) => {
          query = query.replace(/\r?\n|\r/g, '');
          await this.db.executeSql(query, [])
          .then(() => {
            // TODO: remove this line. Left for testing purposes
            console.log(`Query " ${query} " executed`);
          })
          .catch(e => {
            console.error(`Error executing query: ${query}`);
            this.globalErrorHandler.handleError(e, `Error in db.service.ts at runSingleMigrationFile(). Error executing ${query}`);
          });
        });
        await this.db.executeSql('INSERT INTO migrations (name, executed_at) VALUES (?, ?)', [migrationFileName, new Date()])
        .then(() => console.error('Migration ' + migrationFileName + ' marked as completed'))
        .catch(e => {
          this.globalErrorHandler.handleError(e, `Error in db.service.ts at runSingleMigrationFile(). Error inserting migration ${migrationFileName} into migrations table`); 
        });
    });
  }

  async dropDatabase() {
    return await this.sqlite.deleteDatabase({
      name: 'tunalocal.db',
      location: 'default'
    }).then(() => console.log('Database deleted'))
      .catch(e => {
        this.globalErrorHandler.handleError(e, 'Error in db.service.ts at dropDatabase(). Error dropping database');
      });
  }

  setAppRef(id, appRef, table) {
    const params = [appRef, id];
    const query = `UPDATE ${table} SET app_ref = ? WHERE id = ?`;
    this.db.executeSql(query, params).then(() => {
    }).catch((error) => {
      this.globalErrorHandler.handleError(error, `Error in db.service.ts at setAppRef(). Failed to update app_ref for id ${id} in the ${table} table`);
    });
  }

  updateDatabaseField(table, field, value, appRef) {
    const params = [value, appRef];
    const query = `UPDATE ${table} SET ${field} = ? WHERE app_ref = ?`;
    this.db.executeSql(query, params).then(() => {
    }).catch((error) => {
      this.globalErrorHandler.handleError(error, `Error in db.service.ts at updateDatabaseField(). Failed to update the ${field} field for app_ref ${appRef} in the ${table} table`);
    });
  }

  async getEntityOnlineRef(name, table) {
    const params = [name];
    const query = `SELECT online_ref FROM ${table} WHERE app_ref = ?`;
    return this.db.executeSql(query, params).then((data) => {
      if (data.rows.length > 0) {
        return data.rows.item(0).online_ref;
      }
    }).catch((error) => {
      this.globalErrorHandler.handleError(error, `Error in db.service.ts at getEntityOnlineRef(). Failed to get online_ref for app_ref ${name} in the ${table} table`);
    });
  }

  // Use this to delete any record from a table that you want to delete
  deleteEntity(table, appRef) {
    const params = [appRef];
    const query = `DELETE FROM ${table} WHERE app_ref = ?`;
    this.db.executeSql(query, params).then(() => {
      console.log(`Deleted entity ${appRef} from ${table}`)
    }).catch((error) => {
      this.globalErrorHandler.handleError(error, `Error in db.service.ts at deleteEntity(). Failed to delete entity ${appRef} from ${table}`);
    });
  }

  checkIfEntryExists(table, appRef) {
    const params = [appRef];
    const query = `SELECT * FROM ${table} WHERE app_ref = ?`;
    return this.db.executeSql(query, params).then((data) => {
      if (data.rows.length > 0) {
        return true;
      }
      return false;
    }).catch((error) => {
      console.log(error);
      return false;
    });
  }
}
