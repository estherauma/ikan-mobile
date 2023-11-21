import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Injectable({
  providedIn: 'root'
})
export class VesselsDataService {
  db: SQLiteObject;
  vessels = new BehaviorSubject([]);

  constructor(
    public platform: Platform,
    public sqlite: SQLite,
    public sharedMethods: SharedmethodsService,
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
    const query = 'SELECT vessels.*, vessel_images.image_url FROM vessels \
      JOIN vessel_images ON vessels.id = vessel_images.vessel_id';
    this.db.executeSql(query, []).then(async(data) => {
      const vessels = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          vessels.push({
            id: data.rows.item(i).id,
            appRef: data.rows.item(i).app_ref,
            name: data.rows.item(i).name,
            regNo: data.rows.item(i).reg_no,
            vesselType: data.rows.item(i).type,
            status: data.rows.item(i).status,
            capacity: data.rows.item(i).capacity,
            commissioningDate: data.rows.item(i).commissioning_date,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
            imgUrl: data.rows.item(i).image_url || 'assets/imgs/vessel.jpeg',
            onlineRef: data.rows.item(i).online_ref,
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
      data.commissioning_date, data.created_at, data.updated_at, data.created_by, data.updated_by];
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

  getVesselImages() {
    const query = 'SELECT * FROM vessel_images';
    return this.db.executeSql(query, []).then((data) => {
      const vesselImages = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          vesselImages.push({
            id: data.rows.item(i).id,
            vessel_id: data.rows.item(i).vessel_id,
            image_url: data.rows.item(i).image_url,
            description: data.rows.item(i).description,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }
      return vesselImages;
    }).catch((e) => {
      console.log(e);
      return [];
    });
  }

  async getVesselImageByVesselId(vessel_id) {
    const allImages = await this.getVesselImages();
    const image = allImages.find((entry) => entry.vessel_id === vessel_id);
    return image;
  }

  async createVesselImage(data) {
    const query = 'INSERT INTO vessel_images (vessel_id, image_url, description, \
      created_at, updated_at, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const now = this.sharedMethods.getCurrentDateTime();
    const user = await this.sharedMethods.getUserData();
    const params = [data?.vessel_id, data?.image_url, data?.description,
      now, now, user?.id, user?.id];
    
      return this.db.executeSql(query, params).then((result) => {
      this.getVesselImages();
      return result.insertId;
    }).catch(e => console.log(e));
  }

  updateVesselImage() { }

  deleteVesselImage() { }
}
