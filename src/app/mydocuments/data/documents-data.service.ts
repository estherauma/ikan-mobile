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
        console.log('db created------------ppopfnv');
        this.retriveDocuments();
      }).catch(e => console.log(e));
    });

    this.getAll().subscribe((documents) => {
      this.documents = documents;
    });
  }

  async retriveDocuments() {
    console.log('retrieving..........')
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
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }
      console.log('DOCUMENTSSSSSS---retrieve', documents);
      this.documentsObs.next(documents);
      return documents;
    }).catch((e) => {
      console.log(e);
      return [];
    });
  }

  getAll() {
    return this.documentsObs.asObservable();
  }

  async create(data) {
    const query = 'INSERT INTO documents (app_ref, user_id, file_name, file_url, \
      file_size, doc_type, created_at, updated_at, created_by, updated_by) \
      VALUES (?,?,?,?,?,?,?,?,?,?)';
    const params = [data.appRef, data.userId, data.fileName, data.fileUrl,
      data.fileSize, data.docType, data.createdAt, data.updatedAt,
      data.createdBy, data.updatedBy];
    return this.db.executeSql(query, params).then((result) => {
      console.log('inserted--res..', result);
      this.retriveDocuments();
      return result.insertId;
    }).catch((e) => {
      console.log(e);
      return null;
    });
  }

  async saveOnlineDocument(data) {
    const query = 'INSERT INTO documents (online_ref, app_ref, user_id, file_name, file_url, \
      file_size, doc_type, created_at, updated_at, created_by, updated_by) \
      VALUES (?,?,?,?,?,?,?,?,?,?,?)';
    const params = [data.onlineRef, data.appRef, data.userId, data.fileName,
      data.fileUrl, data.fileSize, data.docType, data.createdAt, data.updatedAt,
      data.createdBy, data.updatedBy];
    return this.db.executeSql(query, params).then((result) => {
      console.log('inserted--res..', result);
      this.retriveDocuments();
      return result.insertId;
    }).catch((e) => {
      console.log(e);
      return null;
    });
  }
}
