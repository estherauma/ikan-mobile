import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { DBService } from 'src/app/shared/services/database/db.service';
import { StorageKeys } from 'src/app/shared/types/api-types';
import { ContractDataService } from 'src/app/contracts/data/contract-data.service';

@Injectable({
  providedIn: 'root'
})
export class VesselsDataService {
  db: SQLiteObject;
  vesselsObs = new BehaviorSubject([]);
  vessels = [];

  constructor(
    public platform: Platform,
    public dbService: DBService,
    public sharedMethods: SharedmethodsService,
    public contractDataService: ContractDataService,
  ) {
    this.platform.ready().then(async() => {
      this.db = await this.dbService.configureDB();
    });

    this.dbService.isDBsetup().subscribe(async(res) => {
      if (res) {
        await this.retriveVessels();
        await this.getVesselImages();
      }
    });

    this.getAll().subscribe((data) => {
      this.vessels = data;
    });
  }

  async retriveVessels() {
    const query = 'SELECT \
      vessels.*, \
      json_object(\
        "webPath", vessel_images.image_url \
      ) as image_file \
      FROM vessels \
      LEFT JOIN vessel_images ON vessels.id = vessel_images.vessel_id';
    return this.db.executeSql(query, []).then(async(data) => {
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
            onlineRef: data.rows.item(i).online_ref,
            imageFile: data.rows.item(i).image_file ? JSON.parse(data.rows.item(i).image_file) : null,
          });
        }
      }
      this.vesselsObs.next(vessels);
    }).catch((e) => console.log(e));
  }

  getAll() {
    return this.vesselsObs.asObservable();
  }

  async getVesselByField(field, value) {
    const vessel = this.vessels.find((entry) => entry[field] === value);
    return vessel;
  }

  async create(data) {
    const query = 'INSERT INTO vessels (name, reg_no, type, status, \
      capacity, commissioning_date, created_at, updated_at, created_by, updated_by, app_ref) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    if (!data?.type) { data.type = data.vesselType || data.vessel_type; }
    const params = [data.name, data.reg_no, data.type, data.status, data.capacity,
      data.commissioning_date, data.created_at, data.updated_at, data.created_by, data.updated_by, data.app_ref];
    return this.db.executeSql(query, params).then((result) => {
      this.retriveVessels();
      return result.insertId;
    }).catch(e => console.log(e));
  }

  async saveOnlineVessel(data) {
    const query = 'INSERT INTO vessels (name, reg_no, type, status, \
      capacity, commissioning_date, created_at, updated_at, created_by, \
      updated_by, app_ref, online_ref) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [data.name, data.regNo, data.vesselType, data.status, data.capacity,
      data.commissioningDate, data.createdAt, data.updatedAt, data.createdBy,
      data.updatedBy, data.appRef, data.id];
    return this.db.executeSql(query, params).then((result) => {
      this.retriveVessels();
      return result.insertId;
    }).catch(e => console.log(e));
  }

  update(data) {
    const query = 'UPDATE vessels SET name = ?, reg_no = ?, type = ?, status = ?, \
      capacity = ?, commissioning_date = ?, updated_at = ?, updated_by = ? \
      WHERE id = ?';
    if (!data?.type) { data.type = data.vesselType || data.vessel_type; }
    const params = [data.name, data.reg_no, data.type, data.status, data.capacity,
      data.commissioning_date, data.updated_at, data.updated_by, data.id];

    return this.db.executeSql(query, params).then(async(result) => {
      await this.retriveVessels();
      const vessel = await this.getVesselByField('id', data.id);
      return {
        rowsAffected: result.rowsAffected,
        vessel
      };
    }).catch(e => {
      console.log(e);
      return null;
    });
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
            app_ref: data.rows.item(i).app_ref,
            vessel_id: data.rows.item(i).vessel_id,
            image_url: data.rows.item(i).image_url,
            description: data.rows.item(i).description,
            onlineRef: data.rows.item(i).online_ref,
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

  async getVesselImageByVesselId(vesselId) {
    const allImages = await this.getVesselImages();
    const image = allImages.find((entry) => entry.vessel_id === vesselId);
    return image;
  }

  async createVesselImage(data) {
    const query = 'INSERT INTO vessel_images (vessel_id, image_url, description, app_ref, \
      created_at, updated_at, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const now = this.sharedMethods.getCurrentDateTime();
    const user = await this.sharedMethods.getUserData();
    const params = [data?.vessel_id, data?.image_url, data?.description, data.app_ref,
      now, now, user?.id, user?.id];

      return this.db.executeSql(query, params).then((result) => {
      this.getVesselImages();
      return result.insertId;
    }).catch(e => console.log(e));
  }

  async saveOnlineVesselImage(data) {
    const query = 'INSERT INTO vessel_images (vessel_id, image_url, description, app_ref, \
      created_at, updated_at, created_by, updated_by, online_ref) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [data?.vesselId, data?.imageUrl, data?.description, data.appRef,
      data.createdAt, data.updatedAt, data.createdBy, data.updatedBy, data.id];
    return this.db.executeSql(query, params).then((result) => {
      this.getVesselImages();
      return result.insertId;
    }).catch(e => console.log(e));
  }

  async updateVesselImage(data) {
    const query = 'UPDATE vessel_images SET image_url = ?, description = ?, \
      updated_at = ?, updated_by = ? WHERE id = ?';
    const now = this.sharedMethods.getCurrentDateTime();
    const user = await this.sharedMethods.getUserData();
    const params = [data?.image_url, data?.description, data?.updated_at || now, data?.updated_by || user?.id, data?.id];
    return this.db.executeSql(query, params).then(async(result) => {
      await this.retriveVessels();
      const image = await this.getVesselImageByVesselId(data.vessel_id);
      return {
        rowsAffected: result.rowsAffected,
        image
      };
    }).catch(e => {
      console.log(e);
      return null;
    });
  }

  deleteVesselImage() { }

  // TODO: Refactor when worker has multiple contracts
  async getWorkerVessel() {
    const userContracts = await this.sharedMethods.readDataFromStorage(StorageKeys.currentUserOnlineContractsAppRefs);
    if (userContracts?.length) {
      // TODO: change method when user has multiple contracts
      // const contract = this.contractDataService.contracts.find((c) => userContracts.includes(c.appRef));
      const contract = this.contractDataService.contracts.find((c) => c.appRef === userContracts[0]);
      if (contract && contract?.id) {
        const clause = await this.contractDataService.retrieveClauseByFieldByContractId(
          'kind',
          'contract-clauses-parties-requirement-fishers',
          contract.id
        );
        if (clause) {
          const clauseData = JSON.parse(clause.content);
          if (clauseData?.vessel) {
            const vesselRef = clauseData.vessel;
            const vessels = this.vessels;
            if (vessels.length) {
              const vessel = vessels.find((v) => v.appRef === vesselRef);
              return vessel;
            }
          }
        }
      }
    }
    return null;
  }
}
