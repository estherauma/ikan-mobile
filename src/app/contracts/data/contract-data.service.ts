import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Injectable({
  providedIn: 'root'
})
export class ContractDataService {
  db: SQLiteObject;
  contracts = new BehaviorSubject([]);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    public sharedMethods: SharedmethodsService,
  ) {
    this.platform.ready().then(async() => {
      this.sqlite.create({
        name: 'tunalocal.db',
        location: 'default'
      }).then(async(_db: SQLiteObject) => {
        this.db = _db;
        this.retrieveContracts();
      }).catch(e => console.log(e));
    });
  }

  retrieveContracts() {
    const query = 'SELECT * FROM contracts';
    // TODO: Add a join to the vessel owner company later
    this.db.executeSql(query, []).then((data) => {
      const contracts = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          contracts.push({
            id: data.rows.item(i).id,
            appRef: data.rows.item(i).app_ref,
            internalRef: data.rows.item(i).internal_ref,
            name: data.rows.item(i).name,
            startDate: data.rows.item(i).start_date,
            endDate: data.rows.item(i).end_date,
            onlineRef: data.rows.item(i).online_ref,
            description: data.rows.item(i).description,
            type: data.rows.item(i).type,
            taiwaneseCompany: 'Taiwanese Company',
            indonesianCompany: 'Indonesian Company',
            vesselOwnerCompany: 'Vessel Owner Company',
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by
          });
        }

      }
      this.contracts.next(contracts);
    }).catch((e) => console.log(e));
  }

  getAll() {
    return this.contracts.asObservable();
  }

  create(data) {
    const query = 'INSERT INTO contracts (name, app_ref, internal_ref, start_date, \
      end_date, description, taiwanese_company_id, indonesian_company_id, type,\
      created_at, updated_at, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [data.name, data.app_ref, data.internal_ref, data.start_date, data.end_date,
      data.description, data.taiwanese_company_id, data.indonesian_company_id, data.type,
      data.created_at, data.updated_at, data.created_by, data.updated_by];
    return this.db.executeSql(query, params).then((result) => {
      this.retrieveContracts();
      return result.insertId;
    }).catch((e) => console.log(e));
  }

  update(data) { }

  delete(id) {
    const query = 'DELETE FROM contracts WHERE id = ?';
    const params = [id];
    return this.db.executeSql(query, params).then((result) => {
      this.retrieveContracts();
    }).catch((e) => console.log(e));
  };

  async createContractDocument(data) {
    const query = 'INSERT INTO contract_documents (contract_id, name, url, status, \
      created_at, updated_at, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const now = this.sharedMethods.getCurrentDateTime();
    const user = await this.sharedMethods.getUserData();
    const params = [ data.contract_id, data.name, data.url, data.status,
      now, now, user?.id, user?.id ];
    
    return this.db.executeSql(query, params).then((result) => {
      this.retrieveContractDocuments();
      return result.insertId;
    }).catch((e) => console.log(e));
  }

  retrieveContractDocuments() {
    const query = 'SELECT * FROM contract_documents';
    return this.db.executeSql(query, []).then((data) => {
      const contractDocuments = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          contractDocuments.push({
            id: data.rows.item(i).id,
            contract_id: data.rows.item(i).contract_id,
            name: data.rows.item(i).name,
            url: data.rows.item(i).url,
            status: data.rows.item(i).status,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }
      return contractDocuments;
    }).catch((e) => {
      console.log(e);
      return [];
    });
  }

  updateContractDocument(id, data) { }

  deleteContractDocument(id) { }

  createContractDocumentRecipient(data) { }

  updateContractDocumentRecipient(id, data) { }

  deleteContractRecipient(id) { }

  retrieveContractClauses(contractid) {
    const query  = 'SELECT * FROM contract_clauses WHERE contract_id = ?';
    const params = [contractid];
    return this.db.executeSql(query, params).then((data) => {
      const clauses = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          clauses.push({
            id: data.rows.item(i).id,
            appRef: data.rows.item(i).app_ref,
            name: data.rows.item(i).name,
            kind: data.rows.item(i).kind,
            onlineRef: data.rows.item(i).online_ref,
            content: data.rows.item(i).content,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }
      return clauses;
    });
  }

  saveContractClause(contractId, clauseData) {
    const query = 'INSERT INTO contract_clauses (contract_id, app_ref, \
      name, kind, content, created_at, updated_at, created_by, updated_by) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [contractId, clauseData.app_ref, clauseData.name, clauseData.kind,
      clauseData.content, clauseData.created_at, clauseData.updated_at,
      clauseData.created_by, 
      clauseData.updated_by];
    return this.db.executeSql(query, params).then((result) => {
      console.log('Contract clause saved');
      return result.insertId;
    }).catch((e) => console.log(e));
  }
}
