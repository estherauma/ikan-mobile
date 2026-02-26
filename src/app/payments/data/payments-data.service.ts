import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { DBService } from 'src/app/shared/services/database/db.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentsDataService {
  db: SQLiteObject;
  payments: any = [];
  bankAccounts: any;
  beneficiaries: any;
  paymentsObs = new BehaviorSubject([]);
  bankAccountsObs = new BehaviorSubject([]);
  beneficiariesObs = new BehaviorSubject([]);

  constructor(
    public platform: Platform,
    public dbService: DBService,
    public sharedMethods: SharedmethodsService,
  ) {
    this.platform.ready().then(async() => {
      this.db = await this.dbService.configureDB();
    });

    this.dbService.isDBsetup().subscribe((res) => {
      if (res) {
        this.retrievePayments();
        this.retrieveBankAccounts();
        this.retrieveBeneficiaries();
      }
    });

    this.getAll().subscribe((payments) => {
      this.payments = payments;
    });
    this.getAllBankAccounts().subscribe((bankAccounts) => {
      this.bankAccounts = bankAccounts;
    });
    this.getAllBeneficiaries().subscribe((beneficiaries) => {
      this.beneficiaries = beneficiaries;
    });
  }

  retrievePayments() {
    const query = 'SELECT * FROM user_payments';
    this.db
      .executeSql(query, [])
      .then((data) => {
        const payments = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            payments.push({
              id: data.rows.item(i).id,
              onlineRef: data.rows.item(i).online_ref,
              userId: data.rows.item(i).user_id,
              vesselId: data.rows.item(i).vessel_id,
              paymentDate: data.rows.item(i).payment_date,
              paymentCategory: data.rows.item(i).payment_category,
              paymentMethod: data.rows.item(i).payment_method,
              beneficiaryName: data.rows.item(i).beneficiary_name,
              startDate: data.rows.item(i).start_date,
              endDate: data.rows.item(i).end_date,
              totalUsdAmountReceived:
                data.rows.item(i).total_usd_amount_received,
              cashAmount: data.rows.item(i).cash_amount,
              cashCurrency: data.rows.item(i).cash_currency,
              cashExchangeRate: data.rows.item(i).cash_exchange_rate,
              cashBeneficiaryRelationship:
                data.rows.item(i).cash_beneficiary_relationship,
              cashBeneficiaryName:
                data.rows.item(i).cash_beneficiary_name,
              cashBeneficiaryContact:
                data.rows.item(i).cash_beneficiary_contact,
              cashBeneficiaryContactPlatform:
                data.rows.item(i).cash_beneficiary_contact_platform,
              bankTransferAmount: data.rows.item(i).bank_transfer_amount,
              bankTransferCurrency: data.rows.item(i).bank_transfer_currency,
              bankTransferExchangeRate:
                data.rows.item(i).bank_transfer_exchange_rate,
              bankAccountName: data.rows.item(i).bank_account_name,
              bankAccountNumber: data.rows.item(i).bank_account_number,
              bankName: data.rows.item(i).bank_name,
              bankTransferBeneficiaryRelationship:
                data.rows.item(i).bank_transfer_beneficiary_relationship,
              bankTransferBeneficiaryName:
                data.rows.item(i).bank_transfer_beneficiary_name,
              bankTransferBeneficiaryContact:
                data.rows.item(i).bank_transfer_beneficiary_contact,
              bankTransferBeneficiaryContactPlatform:
                data.rows.item(i).bank_transfer_beneficiary_contact_platform,
              hasDeductions:
                data.rows.item(i).has_deductions ||
                data.rows.item(i).has_deductions === 'true'
                  ? true
                  : false,
              deductions: data.rows.item(i).deductions,
              createdAt: data.rows.item(i).created_at,
              updatedAt: data.rows.item(i).updated_at,
              createdBy: data.rows.item(i).created_by,
              updatedBy: data.rows.item(i).updated_by,
              deletedAt: data.rows.item(i).deleted_at,
              deletedBy: data.rows.item(i).deleted_by,
            });
          }
        }
        this.paymentsObs.next(payments);
      })
      .catch((e) => console.log(e));
  }

  getAll() {
    return this.paymentsObs.asObservable();
  }

  async create(data) {
    const query =
      'INSERT INTO user_payments (user_id, vessel_id, payment_date, payment_category, \
      payment_method, start_date, end_date, total_usd_amount_received, \
      cash_amount, cash_currency, cash_exchange_rate, cash_beneficiary_relationship, \
      cash_beneficiary_name, cash_beneficiary_contact, cash_beneficiary_contact_platform, \
      bank_transfer_amount, bank_transfer_currency, bank_transfer_exchange_rate, \
      bank_account_name, bank_account_number, bank_name, bank_transfer_beneficiary_relationship, \
      bank_transfer_beneficiary_name, bank_transfer_beneficiary_contact, bank_transfer_beneficiary_contact_platform, \
      has_deductions, deductions, created_at, updated_at, created_by, updated_by, \
      deleted_at, deleted_by) VALUES \
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, \
      ?, ?, ?)';
    const params = [
      data.userId,
      data.vesselId,
      data.paymentDate,
      data.paymentCategory,
      data.paymentMethod,
      data.startDate,
      data.endDate,
      data.totalUsdAmountReceived,
      data.cashAmount,
      data.cashCurrency,
      data.cashExchangeRate,
      data.cashBeneficiaryRelationship,
      data.cashBeneficiaryName,
      data.cashBeneficiaryContact,
      data.cashBeneficiaryContactPlatform,
      data.bankTransferAmount,
      data.bankTransferCurrency,
      data.bankTransferExchangeRate,
      data.bankAccountName,
      data.bankAccountNumber,
      data.bankName,
      data.bankTransferBeneficiaryRelationship,
      data.bankTransferBeneficiaryName,
      data.bankTransferBeneficiaryContact,
      data.bankTransferBeneficiaryContactPlatform,
      data.hasDeductions,
      data.deductions,
      data.createdAt,
      data.updatedAt,
      data.createdBy,
      data.updatedBy,
      data.deletedAt,
      data.deletedBy,
    ];

    return this.db.executeSql(query, params).then((result) => {
      this.retrievePayments();
      return result.insertId;
    });
  }

  async saveOnlinePayment(data) {
    const query =
      'INSERT INTO user_payments (online_ref, user_id, vessel_id, payment_date, payment_category, \
      payment_method, start_date, end_date, total_usd_amount_received, \
      cash_amount, cash_currency, cash_exchange_rate, cash_beneficiary_relationship, \
      cash_beneficiary_name, cash_beneficiary_contact, cash_beneficiary_contact_platform, \
      bank_transfer_amount, bank_transfer_currency, bank_transfer_exchange_rate, \
      bank_account_name, bank_account_number, bank_name, bank_transfer_beneficiary_relationship, \
      bank_transfer_beneficiary_name, bank_transfer_beneficiary_contact, bank_transfer_beneficiary_contact_platform, \
      has_deductions, deductions, created_at, updated_at, created_by, updated_by, \
      deleted_at, deleted_by) VALUES \
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, \
      ?, ?, ?, ?)';
    const params = [
      data.onlineRef,
      data.userId,
      data.vesselId,
      data.paymentDate,
      data.paymentCategory,
      data.paymentMethod,
      data.startDate,
      data.endDate,
      data.totalUsdAmountReceived,
      data.cashAmount,
      data.cashCurrency,
      data.cashExchangeRate,
      data.cashBeneficiaryRelationship,
      data.cashBeneficiaryName,
      data.cashBeneficiaryContact,
      data.cashBeneficiaryContactPlatform,
      data.bankTransferAmount,
      data.bankTransferCurrency,
      data.bankTransferExchangeRate,
      data.bankAccountName,
      data.bankAccountNumber,
      data.bankName,
      data.bankTransferBeneficiaryRelationship,
      data.bankTransferBeneficiaryName,
      data.bankTransferBeneficiaryContact,
      data.bankTransferBeneficiaryContactPlatform,
      data.hasDeductions,
      data.deductions,
      data.createdAt,
      data.updatedAt,
      data.createdBy,
      data.updatedBy,
      data.deletedAt,
      data.deletedBy,
    ];

    return this.db.executeSql(query, params).then((result) => {
      this.retrievePayments();
      return result.insertId;
    }).catch((e) => {console.log(e)});
  }

  async checkIfPaymentExists(onlineRef) {
    return await this.payments.some(
      (payment) => payment.onlineRef === onlineRef
    );
  }

  async update(data) {
    const query =
      'UPDATE user_payments SET payment_date = ?, payment_category = ?, \
      payment_method = ?, start_date = ?, end_date = ?, \
      total_usd_amount_received = ?, cash_amount = ?, cash_currency = ?, \
      cash_exchange_rate = ?, cash_beneficiary_relationship = ?, cash_beneficiary_name = ?, \
      cash_beneficiary_contact = ?, cash_beneficiary_contact_platform = ?, bank_transfer_amount = ?, \
      bank_transfer_currency = ?, bank_transfer_exchange_rate = ?, \
      bank_account_name = ?, bank_account_number = ?, bank_name = ?,bank_transfer_beneficiary_relationship = ?,  \
      bank_transfer_beneficiary_name = ?, bank_transfer_beneficiary_contact = ?,\
      bank_transfer_beneficiary_contact_platform = ?, has_deductions = ?, deductions = ?, \
      updated_at = ?, updated_by = ? WHERE online_ref = ?';
    const params = [
      data.paymentDate,
      data.paymentCategory,
      data.paymentMethod,
      data.startDate,
      data.endDate,
      data.totalUsdAmountReceived,
      data.cashAmount,
      data.cashCurrency,
      data.cashExchangeRate,
      data.cashBeneficiaryRelationship,
      data.cashBeneficiaryName,
      data.cashBeneficiaryContact,
      data.cashBeneficiaryContactPlatform,
      data.bankTransferAmount,
      data.bankTransferCurrency,
      data.bankTransferExchangeRate,
      data.bankAccountName,
      data.bankAccountNumber,
      data.bankName,
      data.bankTransferBeneficiaryRelationship,
      data.bankTransferBeneficiaryName,
      data.bankTransferBeneficiaryContact,
      data.bankTransferBeneficiaryContactPlatform,
      data.hasDeductions,
      data.deductions,
      data.updatedAt,
      data.updatedBy,
      data.onlineRef,
    ];
    return await this.db.executeSql(query, params).then((result) => {
      this.retrievePayments();
      return result;
    });
  }

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
    return this.db
      .executeSql(query, [])
      .then((data) => {
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
              isActive:
                data.rows.item(i).is_active ||
                data.rows.item(i).is_active === 'true'
                  ? true
                  : false,
              createdAt: data.rows.item(i).created_at,
              updatedAt: data.rows.item(i).updated_at,
              createdBy: data.rows.item(i).created_by,
              updatedBy: data.rows.item(i).updated_by,
            });
          }
        }
        this.bankAccountsObs.next(bankAccounts);
        return bankAccounts;
      })
      .catch((e) => {
        console.log(e);
        return [];
      });
  }

  getAllBankAccounts() {
    return this.bankAccountsObs.asObservable();
  }

  async getActiveBankAccount(profileId) {
    const allProfileBankAccounts = await this.getUserBankAccounts(profileId);
    if (!allProfileBankAccounts.length) {
      return null;
    }
    const filtered = await allProfileBankAccounts.filter(
      (acct) => acct.isActive === true
    );
    const sorted = await filtered.sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );
    return sorted?.[0] || null;
  }

  async getUserBankAccounts(profileId) {
    return this.bankAccounts.filter((acct) => acct.userId === profileId);
  }

  createBankAccount(data) {
    const query =
      'INSERT INTO user_bank_accounts (app_ref, online_ref, user_id, \
      account_name, account_number, routing_number, swift_code, bank_name, bank_branch, \
      is_active, created_at, updated_at, created_by, updated_by) VALUES \
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [
      data.appRef,
      data.onlineRef,
      data.userId,
      data.accountName,
      data.accountNumber,
      data.routingNumber,
      data.swiftCode,
      data.bankName,
      data.bankBranch,
      data.isActive,
      data.createdAt,
      data.updatedAt,
      data.createdBy,
      data.updatedBy,
    ];
    return this.db.executeSql(query, params).then((result) => {
      this.retrieveBankAccounts();
      return result.insertId;
    });
  }

  updateBankAccount(data) {
    const query =
      'UPDATE user_bank_accounts SET account_name = ?, account_number = ?, \
      routing_number = ?, swift_code = ?, bank_name = ?, bank_branch = ?, is_active = ?, updated_at = ?, updated_by = ? \
      WHERE id = ?';
    const params = [
      data.accountName,
      data.accountNumber,
      data.routingNumber,
      data.swiftCode,
      data.bankName,
      data.bankBranch,
      data.isActive,
      data.updatedAt,
      data.updatedBy,
      data.id,
    ];
    return this.db
      .executeSql(query, params)
      .then((result) => {
        this.retrieveBankAccounts();
        return result;
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  }

  async checkIfBankAccountExists(profileId: string, accountNumber: string) {
    return this.bankAccounts.some(
      (acct) =>
        acct.id === parseFloat(profileId) &&
        acct.accountNumber === accountNumber
    );
  }

  retrieveBeneficiaries() {
    const query = 'SELECT * FROM user_beneficiaries';
    return this.db
      .executeSql(query, [])
      .then((data) => {
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
              isActive:
                data.rows.item(i).is_active ||
                data.rows.item(i).is_active === 'true'
                  ? true
                  : false,
              createdAt: data.rows.item(i).created_at,
              updatedAt: data.rows.item(i).updated_at,
              createdBy: data.rows.item(i).created_by,
              updatedBy: data.rows.item(i).updated_by,
            });
          }
        }
        this.beneficiariesObs.next(beneficiaries);
        return beneficiaries;
      })
      .catch((e) => {
        console.log(e);
        return [];
      });
  }

  getAllBeneficiaries() {
    return this.beneficiariesObs.asObservable();
  }

  async getActiveBeneficiary(profileId) {
    const allProfileBeneficiaries = await this.getUserBeneficiaries(profileId);
    if (!allProfileBeneficiaries.length) {
      return null;
    }
    const filtered = allProfileBeneficiaries.filter(
      (beneficiary) => beneficiary.isActive === true
    );
    const sorted = filtered.sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );
    return sorted?.[0] || null;
  }

  async getUserBeneficiaries(profileId) {
    return this.beneficiaries.filter(
      (beneficiary) => beneficiary.userId === profileId
    );
  }

  createBeneficiary(data) {
    const query =
      'INSERT INTO user_beneficiaries (app_ref, online_ref, user_id, \
      f_name, l_name, account_name, account_number, routing_number, swift_code, bank_name, bank_branch, \
      is_active, created_at, updated_at, created_by, updated_by) VALUES \
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [
      data.appRef,
      data.onlineRef,
      data.userId,
      data.fName,
      data.lName,
      data.accountName,
      data.accountNumber,
      data.routingNumber,
      data.swiftCode,
      data.bankName,
      data.bankBranch,
      data.isActive,
      data.createdAt,
      data.updatedAt,
      data.createdBy,
      data.updatedBy,
    ];
    return this.db
      .executeSql(query, params)
      .then((result) => {
        this.retrieveBeneficiaries();
        return result.insertId;
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  }

  updateBeneficiary(data) {
    const query =
      'UPDATE user_beneficiaries SET f_name = ?, l_name = ?, account_name = ?, account_number = ?, \
      routing_number = ?, swift_code = ?, bank_name = ?, bank_branch = ?, is_active = ?, updated_at = ?, updated_by = ? \
      WHERE id = ?';
    const params = [
      data.fName,
      data.lName,
      data.accountName,
      data.accountNumber,
      data.routingNumber,
      data.swiftCode,
      data.bankName,
      data.bankBranch,
      data.isActive,
      data.updatedAt,
      data.updatedBy,
      data.id,
    ];
    return this.db
      .executeSql(query, params)
      .then((result) => {
        this.retrieveBeneficiaries();
        return result;
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  }

  async checkIfBeneficiaryExists(profileId, accountNumber: string) {
    return this.beneficiaries.some(
      (beneficiary) =>
        beneficiary.id === parseFloat(profileId) &&
        beneficiary.accountNumber === accountNumber
    );
  }

  async deactivateOldAccounts(accountNumber: string, userId: string, table: string) {
    const now = new Date().toISOString();
    const user = await this.sharedMethods.getUserData();
    const params = [now, user?.id, userId, accountNumber];
    const query = `UPDATE ${table} SET updated_at = ?, updated_by = ?, is_active = 0 WHERE user_id = ? and account_number != ?`;
    return await this.db
      .executeSql(query, params)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }
}
