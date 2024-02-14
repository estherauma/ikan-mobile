import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PaymentsDataService } from 'src/app/payments/data/payments-data.service';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { ProfileData } from 'src/app/shared/services/sync/types';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage extends BaseformPage implements OnInit {
  submitButtonText = 'Save';
  acctFormQtns: any;
  beneficiaryFormQtns: any;
  acctGroup = {};
  beneficiaryGroup = {};
  acctFormGroup: FormGroup;
  beneficiaryFormGroup: FormGroup;
  acctData: any;
  beneficiaryData: any;
  userId: any;
  profileData: ProfileData;
  
  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public paymentsDataService: PaymentsDataService,
    public profilesDataService: ProfilesDataService,
  ) {
    super(contentService);
  }

  ngOnInit() {
    this.pageSetup();
  }

  async pageSetup() {
    this.commonText = this.contentService.commonText;
    this.submitButtonText = this.commonText?.save;
    const userData = await this.sharedMethods.getUserData();
    const profData: ProfileData = await this.profilesDataService.getSingleProfile(userData?.email);
    if (profData?.id) {
      this.profileData = profData;
    }
    const acctData = await this.paymentsDataService.getSingleBankAccount(this.profileData?.id);
    if (acctData?.id) {
      this.acctData = acctData;
    }
    const beneficiaryData = await this.paymentsDataService.getSingleBeneficiary(this.profileData?.id);
    if (beneficiaryData?.id) {
      this.beneficiaryData = beneficiaryData;
    }
    this.initializeForms();
  }

  initializeForms() {
    // User account form
    const acctInfoPageData = this.contentService.getContentByPropertyName('accountinformation');
    this.acctFormQtns = acctInfoPageData?.formQuestions;
    this.acctFormQtns.forEach((entry) => {
      // this field will not be displayed
      if (entry.key === 'accountInformation') {
        return;
      }

      const value = this.acctData?.[entry.key] || '';
      this.acctGroup[entry.key] = new FormControl(value, [Validators.required]);

      if (entry.key === 'accountNumber') {
        entry.inputmode = 'numeric';
        this.acctGroup[entry.key] = new FormControl(value, [Validators.required]);
      }
      if (entry.key === 'lastName' || entry.key === 'lName' || entry.key === 'swiftCode') {
        this.acctGroup[entry.key] = new FormControl(value, []);
      }
    });
    
    this.acctFormGroup = new FormGroup(this.acctGroup);

    // Beneficiary form
    const beneficiaryPageData = this.contentService.getContentByPropertyName('beneficiaryaccountinformation');
    this.beneficiaryFormQtns = beneficiaryPageData?.formQuestions;
    this.beneficiaryFormQtns?.forEach((entry) => {
      // this field will not be displayed
      if (entry.key === 'beneficiaryAccountInformation') {
        return;
      }

      const value = this.beneficiaryData?.[entry.key] || '';
      this.beneficiaryGroup[entry.key] = new FormControl(value, [Validators.required]);

      if (entry.key === 'accountNumber') {
        entry.inputmode = 'numeric';
        this.beneficiaryGroup[entry.key] = new FormControl(value, [Validators.required]);
      }
      if (entry.key === 'lastName' || entry.key === 'lName' || entry.key === 'swiftCode') {
        this.beneficiaryGroup[entry.key] = new FormControl(value, []);
      }
    });
    this.beneficiaryFormGroup = new FormGroup(this.beneficiaryGroup);
  }

  async onSubmitAccount(data) {
    this.sharedMethods.showLoader(this.pageText?.savingAccountInfo || 'Saving account information', 2000); // add to prismic
    const userData = await this.sharedMethods.getUserData();
    const now = this.sharedMethods.getCurrentDateTime();
    data.updatedBy = userData.id;
    data.updatedAt = now;
    data.userId = this.profileData?.id;

    const accountExists = await this.paymentsDataService.checkIfBankAccountExists(data.userId);
    if (accountExists) {
      data = { ...this.acctData, ...data};
      const result = await this.paymentsDataService.updateBankAccount(data);
      if (result?.rowsAffected > 0) {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.pageText?.bankAccountUpdateSuccess || 'Bank account updated successfully'); // add to prismic
      } else {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.pageText?.bankAccountUpdateFailure || 'Failed to update bank account'); // add to prismic
      }
    } else {
      data.appRef = this.sharedMethods.generateAppRef();
      data.isActive = true;
      data.createdAt = now;
      data.createdBy = userData.id;
      const insertId = await this.paymentsDataService.createBankAccount(data);
      if (insertId) {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.pageText?.bankAccountCreateSuccess || 'Bank account added successfully'); // add to prismic
      } else {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.pageText?.bankAccountCreateFailure || 'Failed to created bank account'); // add to prismic
      }
    }
  }

  async onSubmitBeneficiary(data) {
    this.sharedMethods.showLoader(this.pageText?.savingBeneficiary || 'Saving beneficiary', 2000); // add to prismic
    const userData = await this.sharedMethods.getUserData();
    const now = this.sharedMethods.getCurrentDateTime();
    data.updatedBy = userData.id;
    data.updatedAt = now;
    data.userId = this.profileData?.id;

    const beneficiaryExists = await this.paymentsDataService.checkIfBeneficiaryExists(data.userId);
    if (beneficiaryExists) {
      data = { ...this.beneficiaryData, ...data};
      const result = await this.paymentsDataService.updateBeneficiary(data);
      if (result?.rowsAffected > 0) {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.pageText?.beneficiaryUpdateSuccess || 'Beneficiary updated successfully'); // add to prismic
      } else {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.pageText?.beneficiaryUpdateFailure || 'Failed to update beneficiary'); // add to prismic
      }
    } else {
      data.appRef = this.sharedMethods.generateAppRef();
      data.isActive = true;
      data.createdAt = now;
      data.createdBy = userData.id;
      const insertId = await this.paymentsDataService.createBeneficiary(data);
      if (insertId) {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.pageText?.beneficiaryCreateSuccess || 'Beneficiary added successfully'); // add to prismic
      } else {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.pageText?.beneficiaryCreateFailure || 'Failed to create beneficiary'); // add to prismic
      }
    }
  }

  viewAll() {}

}
