import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { DocumentType } from 'src/app/shared/types/types';

@Injectable({
  providedIn: 'root'
})
export class DocumentsDataService {

  documents: Array<DocumentType> = [];
  documentsObs = new BehaviorSubject<Array<DocumentType>>(this.documents);
  db: SQLiteObject;

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
        this.retriveDocuments();
        this.retrievePassports();
      }).catch(e => console.log(e));
    });

    this.getAll().subscribe((documents) => {
      this.documents = documents;
    });
  }

  async retriveDocuments() {
    const query = 'SELECT * FROM documents';
    return this.db.executeSql(query, []).then((data) => {
      const documents = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          documents.push({
            id: data.rows.item(i).id,
            onlineRef: data.rows.item(i).online_ref,
            appRef: data.rows.item(i).app_ref,
            userId: data.rows.item(i).user_id,
            fileName: data.rows.item(i).file_name,
            fileUrl: data.rows.item(i).file_url,
            fileSize: data.rows.item(i).file_size,
            docType: data.rows.item(i).doc_type,
            isEssential: this.getIsEssentialValue(data.rows.item(i).is_essential),
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }
      console.log('DOCUMENTSSSSSS---retrieve', documents);
      documents.sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      this.documentsObs.next(documents);
      return documents;
    }).catch((e) => {
      console.log(e);
      return [];
    });
  }

  getIsEssentialValue(value) {
    if (typeof value === 'boolean') {
      return value;
    } else if (typeof value === 'number' && value > 0) {
      return true;
    } else if(typeof value === 'string' && value === 'true') {
      return true;
    } else{
      return false;
    }
  }

  getAll() {
    return this.documentsObs.asObservable();
  }

  async create(data) {
    const query = 'INSERT INTO documents (app_ref, user_id, file_name, file_url, \
      file_size, doc_type, is_essential, created_at, updated_at, created_by, updated_by) \
      VALUES (?,?,?,?,?,?,?,?,?,?,?)';
    const params = [data.appRef, data.userId, data.fileName, data.fileUrl,
      data.fileSize, data.docType, data.isEssential, data.createdAt, data.updatedAt,
      data.createdBy, data.updatedBy];
    return this.db.executeSql(query, params).then(async(result) => {
      await this.retriveDocuments();
      return result.insertId;
    }).catch((e) => {
      console.log(e);
      return null;
    });
  }

  async saveOnlineDocument(data) {
    const query = 'INSERT INTO documents (online_ref, app_ref, user_id, file_name, file_url, \
      file_size, doc_type, is_essential, created_at, updated_at, created_by, updated_by) \
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
    const params = [data.onlineRef, data.appRef, data.userId, data.fileName,
      data.fileUrl, data.fileSize, data.docType, data.isEssential, data.createdAt, data.updatedAt,
      data.createdBy, data.updatedBy];
    return this.db.executeSql(query, params).then((result) => {
      this.retriveDocuments();
      return result.insertId;
    }).catch((e) => {
      console.log(e);
      return null;
    });
  }

  retrievePassports() {
    const query = 'SELECT * FROM passports';
    return this.db.executeSql(query, []).then((data) => {
      const passports = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          passports.push({
            id: data.rows.item(i).id,
            onlineRef: data.rows.item(i).online_ref,
            appRef: data.rows.item(i).app_ref,
            userId: data.rows.item(i).user_id,
            documentId: data.rows.item(i).document_id,
            firstName: data.rows.item(i).first_name,
            surname: data.rows.item(i).surname,
            passportNumber: data.rows.item(i).passport_number,
            dateOfIssue: data.rows.item(i).date_of_issue,
            dateOfExpiry: data.rows.item(i).date_of_expiry,
            imageUrl: data.rows.item(i).image_url,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }
      return passports;
    }).catch((e) => {
      console.log(e);
      return [];
    });
  }

  getUserPassport(userId) {
    const query = 'SELECT * FROM passports WHERE user_id = ?';
    return this.db.executeSql(query, [userId]).then((data) => {
      const passports = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          passports.push({
            id: data.rows.item(i).id,
            onlineRef: data.rows.item(i).online_ref,
            appRef: data.rows.item(i).app_ref,
            userId: data.rows.item(i).user_id,
            documentId: data.rows.item(i).document_id,
            firstName: data.rows.item(i).first_name,
            surname: data.rows.item(i).surname,
            passportNumber: data.rows.item(i).passport_number,
            dateOfIssue: data.rows.item(i).date_of_issue,
            dateOfExpiry: data.rows.item(i).date_of_expiry,
            imageUrl: data.rows.item(i).image_url,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }
      return passports.length ? passports[0] : null;
    }).catch((e) => {
      console.log(e);
      return null;
    });
  }

  async createPassport(data) {
    const query = 'INSERT INTO passports (app_ref, user_id, document_id, first_name, \
      surname, passport_number, date_of_issue, date_of_expiry, image_url, created_at, \
      updated_at, created_by, updated_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const params = [data.appRef, data.userId, data.documentId, data.firstName,
      data.surname, data.passportNumber, data.dateOfIssue, data.dateOfExpiry,
      data.imageUrl, data.createdAt, data.updatedAt, data.createdBy, data.updatedBy];
    return this.db.executeSql(query, params).then((result) => {
      return result.insertId;
    }).catch((e) => {
      console.log(e);
      return null;
    });
  }

  async saveOnlinePassport(data) {
    const query = 'INSERT INTO passports (online_ref, app_ref, user_id, document_id, first_name, \
      surname, passport_number, date_of_issue, date_of_expiry, image_url, created_at, \
      updated_at, created_by, updated_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const params = [data.onlineRef, data.appRef, data.userId, data.documentId, data.firstName,
      data.surname, data.passportNumber, data.dateOfIssue, data.dateOfExpiry,
      data.imageUrl, data.createdAt, data.updatedAt, data.createdBy, data.updatedBy];
    return this.db.executeSql(query, params).then((result) => {
      return result.insertId;
    }).catch((e) => {
      console      .log(e);
      return null;
    });
  }
}
