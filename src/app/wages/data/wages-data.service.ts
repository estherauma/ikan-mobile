import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { DBService } from 'src/app/shared/services/database/db.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { UserData } from 'src/app/shared/types/api-types';

@Injectable({
  providedIn: 'root'
})
export class WagesDataService {
  
  db: SQLiteObject
  wages: any = [];
  wagesObs = new BehaviorSubject([]);
  currentUser: UserData;

  constructor(
    public platform: Platform,
    public dbService: DBService,
    public sharedMethods: SharedmethodsService,
  ) {
    this.platform.ready().then(async() => {
      this.db = await this.dbService.configureDB();
    });

    this.dbService.isDBsetup().subscribe(async(isDBsetup) => {
      this.currentUser = await this.sharedMethods.getUserData();
      if (isDBsetup) {
        this.retrieveWages();
      }
    });

    this.getAll().subscribe((data) => {
      this.wages = data;
    });
  }

  getAll() {
    return this.wagesObs.asObservable();
  }

  async retrieveWages() {
    const query = 'SELECT * FROM wages';
    return this.db.executeSql(query, []).then((data) => {
      const wages = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          wages.push({
            id: data.rows.item(i).id,
            onlineRef: data.rows.item(i).online_ref,
            userId: data.rows.item(i).user_id,
            vesselId: data.rows.item(i).vessel_id,
            paymentDate: data.rows.item(i).payment_date,
            startDate: data.rows.item(i).start_date,
            endDate: data.rows.item(i).end_date,
            usdAmount: data.rows.item(i).usd_amount,
            payslip: data.rows.item(i).payslip,
            crewBankTransferReceipt: data.rows.item(i).crew_bank_transfer_receipt,
            beneficiaryBankTransferReceipt: data.rows.item(i).beneficiary_bank_transfer_receipt,
            beneficiaryRelationship: data.rows.item(i).beneficiary_relationship,
            beneficiaryName: data.rows.item(i).beneficiary_name,
            beneficiaryContact: data.rows.item(i).beneficiary_contact,
            beneficiaryContactPlatform: data.rows.item(i).beneficiary_contact_platform,
            status: data.rows.item(i).status,
            crewReceivedRightAmount: data.rows.item(i).crew_received_right_amount,
            beneficiaryReceivedRightAmount: data.rows.item(i).beneficiary_received_right_amount,
            crewReceivedRightAmountDate: data.rows.item(i).crew_received_right_amount_date,
            beneficiaryReceivedRightAmountDate: data.rows.item(i).beneficiary_received_right_amount_date,
            whyTheDiscrepancy: data.rows.item(i).why_the_discrepancy ? JSON.parse(data.rows.item(i).why_the_discrepancy) : null,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }

      // Sort by status & by descending paymentDate
      const statusOrder = ['action_required', 'issue_pending', 'received'];
      wages.sort((a, b) => {
        const statusComparison = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        if (statusComparison !== 0) {
          return statusComparison;
        }
        return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime();
      });

      this.wagesObs.next(wages);
    });
  }

  async saveOnlineWage(data) {
    const query = `INSERT INTO wages (online_ref, user_id, vessel_id, payment_date,\
    start_date, end_date, usd_amount, payslip, crew_bank_transfer_receipt,\
    beneficiary_bank_transfer_receipt, beneficiary_relationship, beneficiary_name,\
    beneficiary_contact, beneficiary_contact_platform, status, crew_received_right_amount,\
    beneficiary_received_right_amount, crew_received_right_amount_date,\
    beneficiary_received_right_amount_date, why_the_discrepancy, created_at, updated_at, \
    created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [data.onlineRef, data.userId, data.vesselId, data.paymentDate, data.startDate,
      data.endDate, data.usdAmount, data.payslip, data.crewBankTransferReceipt,
      data.beneficiaryBankTransferReceipt, data.beneficiaryRelationship, data.beneficiaryName, data.beneficiaryContact,
      data.beneficiaryContactPlatform, data.status, data.crewReceivedRightAmount, data.beneficiaryReceivedRightAmount,
      data.crewReceivedRightAmountDate, data.beneficiaryReceivedRightAmountDate, data.whyTheDiscrepancy, data.createdAt,
      data.updatedAt, data.createdBy, data.updatedBy
    ];
    return this.db.executeSql(query, params).then(async(result) => {
      await this.retrieveWages();
      return result.insertId;
    }).catch((err) => {
      console.error('Error saving wage', err);
      return null;
    });
  }

  async update(data, wageId) {
    const query = `UPDATE wages SET vessel_id = ?, payment_date = ?, start_date = ?, end_date = ?, \
    usd_amount = ?, payslip = ?, crew_bank_transfer_receipt = ?, beneficiary_bank_transfer_receipt = ?, \
    beneficiary_relationship = ?, beneficiary_name = ?, beneficiary_contact = ?, beneficiary_contact_platform = ?, \
    status = ?, crew_received_right_amount = ?, beneficiary_received_right_amount = ?, \
    crew_received_right_amount_date = ?, beneficiary_received_right_amount_date = ?, \
    why_the_discrepancy = ?, updated_at = ?, updated_by = ? WHERE id = ?`;
    const params = [
      data.vesselId, data.paymentDate, data.startDate, data.endDate, data.usdAmount,
      data.payslip, data.crewBankTransferReceipt, data.beneficiaryBankTransferReceipt, 
      data.beneficiaryRelationship, data.beneficiaryName, data.beneficiaryContact, 
      data.beneficiaryContactPlatform, data.status, data.crewReceivedRightAmount, 
      data.beneficiaryReceivedRightAmount, data.crewReceivedRightAmountDate, data.beneficiaryReceivedRightAmountDate,
      data.whyTheDiscrepancy, data.updatedAt, data.updatedBy, wageId
    ];
    return this.db.executeSql(query, params).then(async(result) => {
      await this.retrieveWages();
      return result;
    }).catch((err) => {
      console.error('Error updating wage', err);
      return null;
    });
  }

  async checkIfWageExists(onlineRef: string) {
    return await this.wages.some((wage) => wage.onlineRef === onlineRef);
  }

  async updateOnlineRef(wageId, onlineRef) {
    const query = `UPDATE wages SET online_ref = ? WHERE id = ?`;
    const params = [onlineRef, wageId];
    return this.db.executeSql(query, params).then(async(result) => {
      await this.retrieveWages();
      return result;
    }).catch((err) => {
      console.error('Error updating wage online ref', err);
      return null;
    });
  }

  async getWageByField(field: string, value: any) {
    return await this.wages.find((wage) => wage[field] === value);
  }
}
