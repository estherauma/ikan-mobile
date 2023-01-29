import { Injectable } from '@angular/core';
// Uncomment when building for native device
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

// import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
// import { SQLiteObject } from 'src/app/shared/services/database/sqlite.mock';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkordersDataService {
  db: SQLiteObject;
  workOrders = new BehaviorSubject([]);

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
        this.retriveWorkOrders();
      }).catch(e => console.log(e));
    });
  }

  retriveWorkOrders() {
    const query = 'SELECT * FROM workorders';
    this.db.executeSql(query, []).then((data) => {
      const workOrders = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          workOrders.push({
            id: data.rows.item(i).id,
            name: data.rows.item(i).name,
            description: data.rows.item(i).description,
            date: data.rows.item(i).date,
            status: data.rows.item(i).status
          });
        }
      }
      this.workOrders.next(workOrders);
    }).catch((e) => console.log(e));
  }

  getAll() {
    return this.workOrders.asObservable();
  }

  create(data) {
    const query = 'INSERT INTO workorders (name, internal_ref, app_ref, created_at,\
       updated_at, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const params = [data.name, data.internal_ref, data.app_ref, data.created_at, data.updated_at, data.created_by,data.updated_by];
    return this.db.executeSql(query, params).then((result) => {
      this.retriveWorkOrders();
    }).catch(e => console.log(e));
  }

  async getOne(id) {
    const allWo = await this.getAll().toPromise();
    const workOrder = allWo.filter((entry) => entry.id === id);
    return workOrder;
  }

  delete(id) {
    const params = [id];
    const query = 'DELETE FROM workorders WHERE id = ?';
    return this.db.executeSql(query, params).then(() => 'Deleted')
    .catch(e => console.log(e));
  }

  update(id, workOrderData) {
    const query = 'UPDATE workorders SET name = ?, internalReference = ?,\
      dateOpened = ?, status = ?  vesselOwnerId = ?, updatedAt = ?, updatedBy = ?\
      WHERE id = ?';
    const params = [workOrderData.name, workOrderData.description, workOrderData.date,
        workOrderData.status, id];
  }

  getWorkOrderClauses(workOrderId) {}

  updateClause(woClauseId) {}
}
