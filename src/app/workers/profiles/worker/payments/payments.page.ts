import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';

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
  
  constructor(
    public contentService: ContentService
  ) {
    super(contentService);
  }

  ngOnInit() {
    this.pageSetup();
  }

  pageSetup() {
    this.commonText = this.contentService.commonText;
    this.submitButtonText = this.commonText?.save;
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

  onSubmitAccount(data) {
    console.log('data....aaaaaccctttt...', data);
  }

  onSubmitBeneficiary(data) {
    console.log('data......bbbbbbbbbeennn.....', data);
  }

  viewAll() {}

}
