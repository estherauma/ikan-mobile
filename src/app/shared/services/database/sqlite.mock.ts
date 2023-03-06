/* eslint-disable object-shorthand */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { SQLiteDatabaseConfig } from '@awesome-cordova-plugins/sqlite/ngx';

/* eslint-disable no-underscore-dangle */
declare let SQL;

class SQLiteObject {
  _objectInstance: any;

  constructor(_objectInstance: any) {
    this._objectInstance = _objectInstance;
  }

  executeSql(statement: string, params: any): Promise<any> {

    return new Promise((resolve,reject)=>{
      try {
        const st = this._objectInstance.prepare(statement,params);
        const rows: Array<any> = [] ;
        while (st.step()) {
            const row = st.getAsObject();
            rows.push(row);
        }
        const payload = {
          rows: {
            item: function(i) {
              return rows[i];
            },
            length: rows.length
          },
          rowsAffected: this._objectInstance.getRowsModified() || 0,
          insertId: this._objectInstance.insertId || void 0
        };

        //save database after each sql query

        const arr: ArrayBuffer = this._objectInstance.export();
        localStorage.setItem('database', String(arr));
        resolve(payload);
      } catch (e) {
        reject(e);
      }
    });
  };
}

class SQLiteMock {
  public create(config: SQLiteDatabaseConfig): Promise<SQLiteObject> {
    let db;
    const storeddb = localStorage.getItem('database');

    if (storeddb) {
      const arr = storeddb.split(',');
      db = new SQL.Database(arr);
    } else {
      db = new SQL.Database();
    }

    return new Promise((resolve, reject) => {
      resolve(new SQLiteObject(db));
    });
  }
}

export { SQLiteMock, SQLiteObject };
