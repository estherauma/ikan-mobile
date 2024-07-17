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
  contractsObs = new BehaviorSubject([]);
  contracts = [];

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

    this.getAll().subscribe((data) => {
      this.contracts = data;
    });
  }

  async retrieveContracts() {
    const query = 'SELECT \
      a.*, \
        json_object(\
          "fileId", b.id,\
          "fileName", b.name,\
          "fileUrl", b.url,\
          "docType", "pdf"\
      ) AS file\
      FROM \
        contracts a\
      LEFT JOIN \
        contract_documents b ON a.id = b.contract_id';
    // TODO: Add a join to the vessel owner company later
    return this.db.executeSql(query, []).then((data) => {
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
            kind: data.rows.item(i).type,
            taiwaneseCompany: data.rows.item(i).taiwanese_company_id,
            indonesianCompany: data.rows.item(i).indonesian_company_id,
            vesselOwnerCompany: 'Vessel Owner Company',
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
            file: this.getFile(data.rows.item(i).file),
          });
        }
      }
      contracts.reverse();
      this.contractsObs.next(contracts);
    }).catch((e) => console.log(e));
  }

  getFile(data) {
    const file = JSON.parse(data);
    return Object.values(file).every(value => value !== null) ? file : null;
  }

  getAll() {
    return this.contractsObs.asObservable();
  }

  getSingleContract(contractId) {
    let contract = {};
    this.contractsObs.getValue().forEach((entry) => {
      if (entry.id == contractId) {
        contract = entry;
        return;
      }
    });
    return contract;
  }

  getContractByField(field, value) {
    let contract = null;
    this.contractsObs.getValue().forEach((entry) => {
      if (entry[field].toString() === value.toString()) {
        contract = entry;
        return false;  // Exit the loop once the condition is met
      }
    });
  
    return contract;
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
    }).catch((e) => {
      console.log(e);
      return null;
    });
  }

  saveOnlineContract(data) {
    const query = 'INSERT INTO contracts (name, app_ref, internal_ref, start_date, \
      end_date, description, taiwanese_company_id, indonesian_company_id, type,\
      created_at, updated_at, created_by, updated_by, online_ref) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [data.name, data.appRef, data.appRef, data.startDate, data.endDate,
      data.description, data.taiwaneseCompany, data.indonesianCompany, data.kind,
      data.createdAt, data.updatedAt, data.createdBy, data.updatedBy, data.id];
    return this.db.executeSql(query, params).then(async(result) => {
      await this.retrieveContracts();
      return result.insertId;
    }).catch((e) => {
      console.log(e);
      return null;
    });
  }

  update(data) {
    const query = 'UPDATE contracts SET name = ?, app_ref = ?, internal_ref = ?, start_date = ?, \
      end_date = ?, description = ?, taiwanese_company_id = ?, indonesian_company_id = ?, type = ?,\
      updated_at = ?, updated_by = ? WHERE id = ?';
    const params = [data.name, data.app_ref, data.internal_ref, data.start_date, data.end_date,
      data.description, data.taiwanese_company_id, data.indonesian_company_id, data.type,
      data.updated_at, data.updated_by, data.id];
    
      return this.db.executeSql(query, params).then(async(result) => {
      await this.retrieveContracts();
      const contract = await this.getSingleContract(data.id);
      return {
        rowsAffected: result.rowsAffected,
        contract,
      };
    }).catch((e) => {
      console.log(e);
      return null;
    });
  }

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

  async saveOnlineContractDocument(data) {
    const query = 'INSERT INTO contract_documents (contract_id, name, url, status, online_ref, \
      created_at, updated_at, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [ data.contractId, data.name, data.url, data.status,
      data.onlineRef, data.createdAt, data.updatedAt, data.createdBy, data.updatedBy ];
    
    return this.db.executeSql(query, params).then(async(result) => {
      await this.retrieveContractDocuments();
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
            onlineRef: data.rows.item(i).online_ref,
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

  async getContractDocumentByField(field, value) {
    const contractDocuments = await this.retrieveContractDocuments();
    const doc = contractDocuments.find(doc => doc?.[field] === value);
    return doc;
  }

  // check if the contract has a document
  async contractDocumentExists(contractId) {
    const docs = await this.retrieveContractDocuments();
    return docs.some(doc => doc.contract_id === contractId);
  }

  async updateContractDocument(contractId, data) {
    const query = 'UPDATE contract_documents SET name = ?, url = ?, status = ?, \
      updated_at = ?, updated_by = ? WHERE contract_id = ?';
    const now = this.sharedMethods.getCurrentDateTime();
    const user = await this.sharedMethods.getUserData();
    const params = [data.name, data.url, data.status, now, user?.id, contractId];
    
    return this.db.executeSql(query, params).then(async(result) => {
      await this.retrieveContractDocuments();
      const doc = await this.getContractDocumentByField('contract_id', contractId);
      return {
        rowsAffected: result.rowsAffected,
        doc,
      };
    }).catch((e) => {
      console.log(e);
      return null;
    });
  }

  async updateContractDocumentFieldByContractId(contractId, field, value) {
    const query = `UPDATE contract_documents SET ${field} = ? WHERE contract_id = ?`;
    const params = [value, contractId];
    return this.db.executeSql(query, params).then((res) => {
      this.retrieveContractDocuments();
      this.retrieveContracts();
      return res.rowsAffected;
    }).catch(e => console.log(3));
  }

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
      return result.insertId;
    }).catch((e) => {
      console.log(e);
      return null;
    });
  }

  updateContractClause(clauseId, clauseData) {
    const query = 'UPDATE contract_clauses SET content = ?, updated_at = ?, updated_by = ? WHERE id = ?'; 
    const params = [clauseData.content, clauseData.updated_at, clauseData.updated_by, clauseId];
    
    return this.db.executeSql(query, params).then(async(result) => {
      const clause = await this.retrieveClauseDetails(clauseId);
      clause.data = clauseData.content;
      return {
        rowsAffected: result.rowsAffected,
        clause,
      };
    }).catch((e) => {
      console.log(e);
      return null;
    });
  }

  saveOnlineContractClause(contractId, clauseData) {
    const query = 'INSERT INTO contract_clauses (online_ref, contract_id, app_ref, \
      name, kind, content, created_at, updated_at, created_by, updated_by) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [clauseData.id, contractId, clauseData.appRef, clauseData.name, clauseData.kind,
      clauseData.content, clauseData.createdAt, clauseData.updatedAt,
      clauseData.createdBy, clauseData.updatedBy];
    return this.db.executeSql(query, params).then((result) => {
      return result.insertId;
    }).catch((e) => {
      console.log(e);
      return null;
    });
  }

  // returns clause object
  retrieveClauseDetails(clauseId) {
    const query = 'SELECT * FROM contract_clauses WHERE id = ?';
    const params = [clauseId];
    return this.db.executeSql(query, params).then((data) => {
      const result = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          result.push({
            id: data.rows.item(i).id,
            appRef: data.rows.item(i).app_ref,
            name: data.rows.item(i).name,
            kind: data.rows.item(i).kind,
            onlineRef: data.rows.item(i).online_ref,
            content: data.rows.item(i).content,
            data: data.rows.item(i).content,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }
      return result[0];
    });
  }
  
  async retrieveContractClausesByField(field, value) {
    const query = `SELECT * FROM contract_clauses WHERE ${field} = ?`;
    const params = [value];
    return this.db.executeSql(query, params).then((data) => {
      const result = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          result.push({
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
      return result;
    });
  }
}
