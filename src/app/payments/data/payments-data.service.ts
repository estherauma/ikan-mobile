import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsDataService {
  db: SQLiteObject;
  payments = new BehaviorSubject([]);

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
        this.retrievePayments();
      }).catch(e => console.log(e));
    });
  }

  retrievePayments() {
    const query = 'SELECT * FROM payments';
    this.db.executeSql(query, []).then((data) => {
      const payments = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          payments.push({
            id: data.rows.item(i).id,
            companyName: data.rows.item(i).company_id,
            type: data.rows.item(i).type,
            worker: data.rows.item(i).worker_id,
            totalAmount: data.rows.item(i).total_amount,
            remmitanceAmount: data.rows.item(i).remmitance_amount,
            beneficiaryAmount: data.rows.item(i).beneficiary_amount,
            cashAmount: data.rows.item(i).cash_amount,
            date: data.rows.item(i).date,
            status: data.rows.item(i).status,
            confirmed: data.rows.item(i).confirmed,
            confirmedDate: data.rows.item(i).confirmed_date,
            fileUrl: data.rows.item(i).file_url,
            onlineRef: data.rows.item(i).online_ref,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }
      this.payments.next(payments);
    }).catch((e) => console.log(e));
  }

  getAll() {
    return this.payments.asObservable();
  }

  async create(data) {
    const query = 'INSERT INTO payments (date, payment_ref, company_id, type, worker_id, total_amount, \
      remmitance_amount, beneficiary_amount, cash_amount, date, status, file_url, \
      created_at, updated_at, created_by, updated_by) VALUES \
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [data.paymentDate, data.payment_ref, data.company_id, data.paymentType, data.recipient, data.total,
      data.remittance, data.beneficiary, data.cash, data.date,
      data.status, data?.file_url, data.created_at, data.updated_at, data.created_by,
      data.updated_by];
      return this.db.executeSql(query, params).then((result) => {
        this.retrievePayments();
        return result.insertId;
      });
  }

  update() {}

  delete() {
    const query = 'DELETE FROM payments WHERE id = ?';
    const params = [1];
    return this.db.executeSql(query, params).then((result) => {
      this.retrievePayments();
      return result;
    });
  }
}
