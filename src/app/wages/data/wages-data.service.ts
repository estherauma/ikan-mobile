import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { DBService } from 'src/app/shared/services/database/db.service';

@Injectable({
  providedIn: 'root'
})
export class WagesDataService {
  
  db: SQLiteObject
  wages: any = [];
  wagesObs = new BehaviorSubject([]);

  constructor(
    public platform: Platform,
    public dbService: DBService,
  ) {
    this.platform.ready().then(async() => {
      this.db = await this.dbService.configureDB();
    });

    this.dbService.isDBsetup().subscribe((isDBsetup) => {
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

  retrieveWages() {
    const query = 'SELECT * FROM wages';
    this.db.executeSql(query, []).then((data) => {
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
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }
      this.wagesObs.next(wages);
    });
  }

  async saveOnlineWage(data) {
    const query = `INSERT INTO wages (online_ref, user_id, vessel_id, payment_date,\
    start_date, end_date, usd_amount, payslip, crew_bank_transfer_receipt,\
    beneficiary_bank_transfer_receipt, beneficiary_relationship, beneficiary_name,\
    beneficiary_contact, beneficiary_contact_platform, created_at, updated_at, \
    created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      data.onlineRef,
      data.userId,
      data.vesselId,
      data.paymentDate,
      data.startDate,
      data.endDate,
      data.usdAmount,
      data.payslip,
      data.crewBankTransferReceipt,
      data.beneficiaryBankTransferReceipt,
      data.beneficiaryRelationship,
      data.beneficiaryName,
      data.beneficiaryContact,
      data.beneficiaryContactPlatform,
      data.createdAt,
      data.updatedAt,
      data.createdBy,
      data.updatedBy
    ];
    return this.db.executeSql(query, params).then((result) => {
      this.retrieveWages();
      return result.insertId;
    }).catch((err) => {
      console.error('Error saving wage', err);
      return null;
    });
  }

  async checkIfWageExists(onlineRef: string) {
    return await this.wages.some((wage) => wage.onlineRef === onlineRef);
  }
}
