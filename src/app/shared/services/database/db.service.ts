import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error-handler/global-error-handler.service';
import { lastValueFrom, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DBService {
  db: SQLiteObject;
  dbObs = new Subject<boolean>();
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
  ];

  constructor(
    private sqlite: SQLite,
    public platform: Platform,
    public http: HttpClient,
    public globalErrorHandler: GlobalErrorHandlerService,
  ) {}

  async configureDB() {
    await this.platform.ready();
    const db = await this.sqlite.create({
      name: 'tunalocal.db',
      location: 'default',
    }).catch((e) => {
      console.error(e);
      return null;
    });

    return db;
  }

  isDBsetup() {
    return this.dbObs.asObservable();
  }

  async checkDbPlatformAndRunMigration(seedData = false) {
    try {
      this.db = await this.configureDB();
      if (this.db) {
        await this.createMigrationsTable();
        this.executedMigrations = await this.readMigrationsTable();
        await this.getAndRunPendingMigrations(seedData);

        this.dbObs.next(true);
      }
    } catch (e) {
      this.globalErrorHandler.handleError(
        e,
        'Error in db.service.ts at checkDbPlatformAndRunMigration(). Error creating database or running migrations'
      );
    }
  }

  checkDBStatus() {
    this.sqlite.echoTest()
      .then(() => console.log('DB is ready'))
      .catch(e => {
        this.globalErrorHandler.handleError(e, 'Error in db.service.ts at checkDBStatus(). Error checking database status');
      });
  }

  async createMigrationsTable() {
    return this.db.executeSql(
      'CREATE TABLE IF NOT EXISTS migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, executed_at DATETIME)',
      []
    ).then(() => {})
    .catch(e => {
      this.globalErrorHandler.handleError(
        e,
        'Error in db.service.ts at createMigrationsTable(). Error creating migrations table or table already exists'
      );
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

  async getAndRunPendingMigrations(seedData = false): Promise<void> {
    try {
      const data = await lastValueFrom(
        this.http.get('assets/migrations/migrations-list.txt', { responseType: 'text' as const })
      );

      // Split file list by lines
      this.allMigrationFiles = (data as string)?.split('\n').filter(line => line.trim() !== '') || [];

      // Filter migrations already executed
      this.pendingMigrations = this.allMigrationFiles.filter(
        x => !this.executedMigrations.includes(x)
      );

      if (!seedData) {
        this.pendingMigrations = this.pendingMigrations.filter(file => !file.includes('SeedData'));
      } else {
        this.pendingMigrations = this.pendingMigrations.filter(file => file.includes('SeedData'));
      }

      console.log('Pending migrations:', this.pendingMigrations);
      await this.runPendingMigrations(this.pendingMigrations);
    } catch (error) {
      console.error('Error loading or running pending migrations:', error);
      this.globalErrorHandler.handleError(error, 'Failed to get and run pending migrations');
    }
  }

  async runPendingMigrations(pendingMigrations: string[]) {
    for (const migration of pendingMigrations) {
      await this.runSingleMigrationFile(migration);
    }
  }

  async runSingleMigrationFile(migrationFileName: string): Promise<void> {
    try {
      const data = await lastValueFrom(
        this.http.get('assets/migrations/' + migrationFileName, { responseType: 'text' as const })
      );
      const cleanedData = data.replace(/\/\*[\s\S]*?\*\/|--.*$/gm, '');
      // Split into individual queries (by semicolon)
      const migrationQueries = cleanedData.split(';').map(q => q.trim()).filter(q => q);

      for (const query of migrationQueries) {
        const trimmedQuery = query.replace(/\r?\n|\r/g, '').trim();
        if (!trimmedQuery) { continue; }

        try {
          await this.db.executeSql(trimmedQuery, []);
          console.log(`Query "${trimmedQuery}" executed`,);

          // Insert migration record if query succeeded
          try {
            await this.db.executeSql(
              'INSERT INTO migrations (name, executed_at) VALUES (?, ?)',
              [migrationFileName, new Date()]
            );
            console.log(`Migration "${migrationFileName}" marked as completed.`);
          } catch (insertError) {
            console.error('Error inserting migration record:', insertError);
            this.globalErrorHandler.handleError(
              insertError,
              `Error inserting migration ${migrationFileName} into migrations table`
            );
          }
        } catch (queryError) {
          // Ignore non-errors from SQLite
          if (
            queryError.code !== 0 ||
            queryError.message !== 'sqlite3_step failure: not an error'
          ) {
            console.error(`Error executing query: ${trimmedQuery}`, queryError);
            this.globalErrorHandler.handleError(
              queryError,
              `Error executing query: ${trimmedQuery}`
            );
          }
        }
      }
    } catch (fileError) {
      console.error('Error loading migration file:', fileError);
      this.globalErrorHandler.handleError(
        fileError,
        `Failed to load migration file: ${migrationFileName}`
      );
    }
  }

  async dropDatabase() {
    return this.sqlite.deleteDatabase({
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
      this.globalErrorHandler.handleError(
        error,
        `Error in db.service.ts at setAppRef(). Failed to update app_ref for id ${id} in the ${table} table`
      );
    });
  }

  updateDatabaseField(table, field, value, appRef) {
    const params = [value, appRef];
    const query = `UPDATE ${table} SET ${field} = ? WHERE app_ref = ?`;
    this.db.executeSql(query, params).then(() => {
    }).catch((error) => {
      this.globalErrorHandler.handleError(
        error,
        `Error in db.service.ts at updateDatabaseField(). Failed to update the ${field} field for app_ref ${appRef} in the ${table} table`
      );
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
      this.globalErrorHandler.handleError(
        error,
        `Error in db.service.ts at getEntityOnlineRef(). Failed to get online_ref for app_ref ${name} in the ${table} table`
      );
    });
  }

  // Use this to delete any record from a table that you want to delete
  deleteEntity(table, appRef) {
    const params = [appRef];
    const query = `DELETE FROM ${table} WHERE app_ref = ?`;
    return this.db.executeSql(query, params).then(() => {
      console.log(`Deleted entity ${appRef} from ${table}`);
    }).catch((error) => {
      this.globalErrorHandler.handleError(
        error,
        `Error in db.service.ts at deleteEntity(). Failed to delete entity ${appRef} from ${table}`
      );
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
