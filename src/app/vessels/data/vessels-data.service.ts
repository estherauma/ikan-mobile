import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class VesselsDataService {
  db: SQLiteObject;
  vessels = new BehaviorSubject([]);

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
        this.retriveVessels();
      }).catch(e => console.log(e));
    });
  }

  retriveVessels() {
    const query = 'SELECT * FROM vessels';
    this.db.executeSql(query, []).then((data) => {
      const vessels = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          vessels.push({
            id: data.rows.item(i).id,
            name: data.rows.item(i).name,
            regNo: data.rows.item(i).reg_no,
            type: data.rows.item(i).type,
            status: data.rows.item(i).status,
            capacity: data.rows.item(i).capacity,
            commissioningData: data.rows.item(i).commissioning_date,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }
      this.vessels.next(vessels);
    }).catch((e) => console.log(e));
  }

  getAll() {
    return this.vessels.asObservable();
  }

  async create(data) {
    const query = 'INSERT INTO vessels (name, reg_no, type, status, \
      capacity, commissioning_date, created_at, updated_at, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [data.name, data.reg_no, data.type, data.status, data.capacity,
      data.commissiong_date, data.created_at, data.updated_at, data.created_by, data.updated_by];
    return this.db.executeSql(query, params).then((result) => {
      this.retriveVessels();
      return result.insertId;
    }).catch(e => console.log(e));
  }

  update() {

  }

  delete(id) {
    const query = 'DELETE FROM vessels WHERE id = ?';
    const params = [id];
    return this.db.executeSql(query, params).then((result) => {
      this.retriveVessels();
      // TODO: Delete all work orders and images related to this vessel
    });
  }
   // These are functions we'll need to build out later
  getVesselWorkOrders() { }

  getVesselImages() { }

  createVesselImage() { }

  updateVesselImage() { }

  deleteVesselImage() { }
}
