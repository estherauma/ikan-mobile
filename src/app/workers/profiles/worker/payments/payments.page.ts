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

    // TODO: maintain leading zeros for account number
    const acctInfoPageData = this.contentService.getContentByPropertyName('accountinformation');
    this.acctFormQtns = acctInfoPageData?.formQuestions;

    const beneficiaryPageData = this.contentService.getContentByPropertyName('beneficiaryaccountinformation');
    this.beneficiaryFormQtns = beneficiaryPageData?.formQuestions;

    this.acctFormQtns.forEach((entry) => {
      this.acctGroup[entry.key] = new FormControl('', [Validators.required]);
    });
    this.acctFormGroup = new FormGroup(this.acctGroup);

    this.beneficiaryFormQtns?.forEach((entry) => {
      this.beneficiaryGroup[entry.key] = new FormControl('', [Validators.required]);
    });
    this.beneficiaryFormGroup = new FormGroup(this.beneficiaryGroup);
  }

  onSubmit(data) {}

  viewAll() {}

}
