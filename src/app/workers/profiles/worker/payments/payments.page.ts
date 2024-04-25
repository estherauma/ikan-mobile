import { Component, Input, OnInit } from '@angular/core';
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
  @Input() page: 'loggedin-user-payments' | 'vo-workers-payments' = 'loggedin-user-payments';
  @Input() workerInfo: any;
  
  submitButtonText = 'Save';
  acctFormQtns: any;
  beneficiaryFormQtns: any;
  acctGroup = {};
  beneficiaryGroup = {};
  acctFormGroup: FormGroup;
  beneficiaryFormGroup: FormGroup;
  acctData: any;
  beneficiaryData: any;
  profileId: any;
  profileData: ProfileData;
  acctPageText: any;
  benficiaryPageText: any;
  isViewAcct: boolean = false;
  isViewBeneficiary: boolean = false;
  isEditingAcct: boolean = false;
  isEditingBeneficiary: boolean = false;
  isAddingAcct: boolean = false;
  isAddingBeneficiary: boolean = false;
  acctPageTitle: string = '';
  beneficiaryPageTitle: string = '';
  
  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public paymentsDataService: PaymentsDataService,
    public profilesDataService: ProfilesDataService,
  ) {
    super(contentService);
  }

  async ngOnInit() {
    await this.pageSetup();
  }

  async pageSetup() {
    this.commonText = this.contentService.commonText;
    this.submitButtonText = (this.isEditingAcct || this.isEditingBeneficiary) ? this.commonText?.update : this.commonText?.save;
    const userData = await this.sharedMethods.getUserData();

    let profData: ProfileData = await this.profilesDataService.getSingleProfile(userData?.email);
    if (this.page === 'vo-workers-payments') {
      profData = this.workerInfo;
    }

    if (profData?.id) {
      this.profileData = profData;
    }
    this.profileId = typeof this.profileData?.id === 'number' ? this.profileData?.id : parseFloat(this.profileData?.id);
    const acctData = await this.paymentsDataService.getActiveBankAccount(this.profileId);
    if (acctData?.id) {
      this.isViewAcct = true;
      this.acctData = acctData;
    }
    const beneficiaryData = await this.paymentsDataService.getActiveBeneficiary(this.profileId);
    if (beneficiaryData?.id) {
      this.isViewBeneficiary = true;
      this.beneficiaryData = beneficiaryData;
    }
    this.initializeForms();
  }

  initializeForms() {
    // User account form
    const acctInfoPageData = this.contentService.getContentByPropertyName('accountinformation');
    this.acctPageTitle = acctInfoPageData?.pageTitle;
    this.acctPageText = this.sharedMethods.convertAdditionalTextToObj(acctInfoPageData?.additionalText);
    this.acctFormQtns = acctInfoPageData?.formQuestions;
    this.acctFormQtns.forEach((entry) => {
      // this field will not be displayed
      if (entry.key === 'accountInformation') {
        return;
      }

      const validators = [];
      if (entry.isRequired) {
        validators.push(Validators.required);
      }

      const value = this.isEditingAcct ? (this.acctData?.[entry.key] || '') : '';
      this.acctGroup[entry.key] = new FormControl(value, validators);
    });
    
    this.acctFormGroup = new FormGroup(this.acctGroup);

    // Beneficiary form
    const beneficiaryPageData = this.contentService.getContentByPropertyName('beneficiaryaccountinformation');
    this.beneficiaryPageTitle = beneficiaryPageData?.pageTitle;
    this.benficiaryPageText = this.sharedMethods.convertAdditionalTextToObj(beneficiaryPageData?.additionalText);
    this.beneficiaryFormQtns = beneficiaryPageData?.formQuestions;
    this.beneficiaryFormQtns?.forEach((entry) => {
      // this field will not be displayed
      if (entry.key === 'beneficiaryAccountInformation') {
        return;
      }

      const validators = [];
      if (entry.isRequired) {
        validators.push(Validators.required);
      }

      const value = this.isEditingBeneficiary ? (this.beneficiaryData?.[entry.key] || '') : '';
      this.beneficiaryGroup[entry.key] = new FormControl(value, validators);
    });
    this.beneficiaryFormGroup = new FormGroup(this.beneficiaryGroup);
  }

  async onSubmitAccount(data) {
    this.sharedMethods.showLoader(this.acctPageText?.savingAccountInfo, 2000);
    const userData = await this.sharedMethods.getUserData();
    const now = this.sharedMethods.getCurrentDateTime();
    data.updatedBy = userData.id;
    data.updatedAt = now;
    data.userId = this.profileId;

    const accountExists = await this.paymentsDataService.checkIfBankAccountExists(data.userId, data?.accountNumber);
    if (accountExists) {
      data = { ...this.acctData, ...data};
      const result = await this.paymentsDataService.updateBankAccount(data);
      if (result?.rowsAffected > 0) {
        await this.paymentsDataService.deactivateOldAccounts(data?.accountNumber, data.userId, 'user_bank_accounts');
        this.isAddingAcct = false;
        this.isEditingAcct = false;
        await this.pageSetup();
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.acctPageText?.bankAccountUpdateSuccess);
      } else {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.acctPageText?.bankAccountUpdateFailure);
      }
    } else {
      data.appRef = this.sharedMethods.generateAppRef();
      data.isActive = true;
      data.createdAt = now;
      data.createdBy = userData.id;
      const insertId = await this.paymentsDataService.createBankAccount(data);
      if (insertId) {
        await this.paymentsDataService.deactivateOldAccounts(data?.accountNumber, data.userId, 'user_bank_accounts');
        this.isAddingAcct = false;
        this.isEditingAcct = false;
        await this.pageSetup();
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.acctPageText?.bankAccountCreateSuccess);
      } else {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.acctPageText?.bankAccountCreateFailure);
      }
    }
  }

  async editAccount() {
    this.isEditingAcct = true;
    await this.pageSetup();
    this.isViewAcct = false;
  }

  async addNewAccount() {
    this.isEditingBeneficiary = false;
    this.isEditingAcct = false;
    this.isAddingAcct = true;
    await this.pageSetup();
    this.isViewAcct = false;
  }

  async cancelAcctEdit() {
    this.isEditingAcct = false;
    this.isAddingAcct = false;
    this.isViewAcct = true;
    await this.pageSetup();
  }

  async onSubmitBeneficiary(data) {
    this.sharedMethods.showLoader(this.benficiaryPageText?.savingBeneficiary, 2000);
    const userData = await this.sharedMethods.getUserData();
    const now = this.sharedMethods.getCurrentDateTime();
    data.updatedBy = userData.id;
    data.updatedAt = now;
    data.userId = this.profileId;

    const beneficiaryExists = await this.paymentsDataService.checkIfBeneficiaryExists(data.userId, data.accountNumber);
    if (beneficiaryExists) {
      data = { ...this.beneficiaryData, ...data};
      const result = await this.paymentsDataService.updateBeneficiary(data);
      if (result?.rowsAffected > 0) {
        await this.paymentsDataService.deactivateOldAccounts(data?.accountNumber, data.userId, 'user_beneficiaries');
        this.isAddingBeneficiary = false;
        this.isEditingBeneficiary = false;
        this.pageSetup();
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.benficiaryPageText?.beneficiaryUpdateSuccess);
      } else {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.benficiaryPageText?.beneficiaryUpdateFailure);
      }
    } else {
      data.appRef = this.sharedMethods.generateAppRef();
      data.isActive = true;
      data.createdAt = now;
      data.createdBy = userData.id;

      const insertId = await this.paymentsDataService.createBeneficiary(data);
      if (insertId) {
        await this.paymentsDataService.deactivateOldAccounts(data?.accountNumber, data.userId, 'user_beneficiaries');
        this.isAddingBeneficiary = false;
        this.isEditingBeneficiary = false;
        await this.pageSetup();
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.benficiaryPageText?.beneficiaryCreateSuccess);
      } else {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.benficiaryPageText?.beneficiaryCreateFailure);
      }
    }
  }

  async editBeneficiary () {
    this.isEditingBeneficiary = true;
    await this.pageSetup();
    this.isViewBeneficiary = false;
  }

  async addNewBeneficiary () {
    this.isEditingAcct = false;
    this.isEditingBeneficiary = false;
    this.isAddingBeneficiary = true;
    await this.pageSetup();
    this.isViewBeneficiary = false;
  }

  async cancelBeneficiaryEdit () {
    this.isEditingBeneficiary = false;
    this.isAddingBeneficiary = true;
    this.isViewBeneficiary = true;
    await this.pageSetup();
  }

  viewAll() {}

}
