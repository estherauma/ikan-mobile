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
  bankAccounts = new BehaviorSubject([]);
  beneficiaries = new BehaviorSubject([]);

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
        this.retrieveBankAccounts();
        this.retrieveBeneficiaries();
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

  retrieveBankAccounts() {
    const query = 'SELECT * FROM user_bank_accounts';
    return this.db.executeSql(query, []).then((data) => {
      const bankAccounts = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          bankAccounts.push({
            id: data.rows.item(i).id,
            appRef: data.rows.item(i).app_ref,
            onlineRef: data.rows.item(i).online_ref,
            userId: data.rows.item(i).user_id,
            accountName: data.rows.item(i).account_name,
            accountNumber: data.rows.item(i).account_number,
            routingNumber: data.rows.item(i).routing_number,
            swiftCode: data.rows.item(i).swift_code,
            bankName: data.rows.item(i).bank_name,
            bankBranch: data.rows.item(i).bank_branch,
            isActive: (data.rows.item(i).is_active || data.rows.item(i).is_active === 'true') ? true : false,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }
      this.bankAccounts.next(bankAccounts);
      return bankAccounts;
    }).catch((e) => {
      console.log(e);
      return [];
    });
  }

  getAllBankAccounts() {
    return this.bankAccounts.asObservable();
  }

  async getSingleBankAccount(userId) {
    const bankAccounts = await this.retrieveBankAccounts();
    const acct = bankAccounts.find((acct) => acct.userId === userId);
    return acct;
  }

  createBankAccount(data) {
    const query = 'INSERT INTO user_bank_accounts (app_ref, online_ref, user_id, \
      account_name, account_number, routing_number, swift_code, bank_name, bank_branch, \
      is_active, created_at, updated_at, created_by, updated_by) VALUES \
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [data.appRef, data.onlineRef, data.userId, data.accountName, data.accountNumber,
      data.routingNumber, data.swiftCode, data.bankName, data.bankBranch, data.isActive, data.createdAt,
      data.updatedAt, data.createdBy, data.updatedBy];
    return this.db.executeSql(query, params).then((result) => {
      this.retrieveBankAccounts();
      return result.insertId;
    });
  }

  updateBankAccount(data) {
    const query = 'UPDATE user_bank_accounts SET account_name = ?, account_number = ?, \
      routing_number = ?, swift_code = ?, bank_name = ?, bank_branch = ?, is_active = ?, updated_at = ?, updated_by = ? \
      WHERE id = ?';
    const params = [data.accountName, data.accountNumber, data.routingNumber, data.swiftCode, data.bankName,
      data.bankBranch, data.isActive, data.updatedAt, data.updatedBy, data.id];
    return this.db.executeSql(query, params).then((result) => {
      this.retrieveBankAccounts();
      return result;
    }).catch((e) => {
      console.error(e);
      return null;
    });
  }

  async checkIfBankAccountExists(userId: string) {
    const bankAccounts = await this.retrieveBankAccounts();
    const acctExists = bankAccounts.some((acct) => acct.userId === userId);
    return acctExists;
  }

  retrieveBeneficiaries() {
    const query = 'SELECT * FROM user_beneficiaries';
    return this.db.executeSql(query, []).then((data) => {
      const beneficiaries = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          beneficiaries.push({
            id: data.rows.item(i).id,
            appRef: data.rows.item(i).app_ref,
            onlineRef: data.rows.item(i).online_ref,
            userId: data.rows.item(i).user_id,
            fName: data.rows.item(i).f_name,
            lName: data.rows.item(i).l_name,
            accountName: data.rows.item(i).account_name,
            accountNumber: data.rows.item(i).account_number,
            routingNumber: data.rows.item(i).routing_number,
            swiftCode: data.rows.item(i).swift_code,
            bankName: data.rows.item(i).bank_name,
            bankBranch: data.rows.item(i).bank_branch,
            isActive: (data.rows.item(i).is_active || data.rows.item(i).is_active === 'true') ? true : false,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }
      this.beneficiaries.next(beneficiaries);
      return beneficiaries;
    }).catch((e) => {
      console.log(e);
      return [];
    });
  }

  getAllBeneficiaries() {
    return this.beneficiaries.asObservable();
  }

  async getSingleBeneficiary(userId) {
    const beneficiaries = await this.retrieveBeneficiaries();
    const beneficiary = beneficiaries.find((beneficiary) => beneficiary.userId === userId);
    return beneficiary;
  }

  createBeneficiary(data) {
    const query = 'INSERT INTO user_beneficiaries (app_ref, online_ref, user_id, \
      f_name, l_name, account_name, account_number, routing_number, swift_code, bank_name, bank_branch, \
      is_active, created_at, updated_at, created_by, updated_by) VALUES \
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [data.appRef, data.onlineRef, data.userId, data.fName, data.lName, data.accountName,
      data.accountNumber, data.routingNumber, data.swiftCode, data.bankName, data.bankBranch, data.isActive,
      data.createdAt, data.updatedAt, data.createdBy, data.updatedBy];
    return this.db.executeSql(query, params).then((result) => {
      this.retrieveBeneficiaries();
      return result.insertId;
    }).catch((e) => {
      console.error(e);
      return null;
    });
  }

  updateBeneficiary(data) {
    const query = 'UPDATE user_beneficiaries SET f_name = ?, l_name = ?, account_name = ?, account_number = ?, \
      routing_number = ?, swift_code = ?, bank_name = ?, bank_branch = ?, is_active = ?, updated_at = ?, updated_by = ? \
      WHERE id = ?';
    const params = [data.fName, data.lName, data.accountName, data.accountNumber, data.routingNumber, data.swiftCode,
      data.bankName, data.bankBranch, data.isActive, data.updatedAt, data.updatedBy, data.id];
    return this.db.executeSql(query, params).then((result) => {
      this.retrieveBeneficiaries();
      return result;
    }).catch((e) => {
      console.error(e);
      return null;
    });
  }

  async checkIfBeneficiaryExists(userId) {
    const beneficiaries = await this.retrieveBeneficiaries();
    const beneficiaryExists = beneficiaries.some((beneficiary) => (beneficiary.userId === userId));
    return beneficiaryExists;
  }
}
