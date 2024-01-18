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
  submitButtonText = 'Save changes';
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
    const pageData = this.contentService.getContentByPropertyName('createplacementinfo');
    this.pageTitle = pageData?.pageTitle;
    this.submitButtonText = this.commonText?.saveChanges;
    this.formQuestions = pageData?.formQuestions;
    const acctInfoIndex = this.formQuestions.findIndex((entry) => entry.key === 'accountInformation');
    this.acctFormQtns = this.formQuestions.slice(0, acctInfoIndex);
    this.beneficiaryFormQtns = this.formQuestions.slice(acctInfoIndex);

    this.acctFormQtns.forEach((entry) => {
      this.acctGroup[entry.key] = new FormControl('', [Validators.required]);
    });
    this.acctFormGroup = new FormGroup(this.acctGroup);

    this.beneficiaryFormQtns.forEach((entry) => {
      this.beneficiaryGroup[entry.key] = new FormControl('', [Validators.required]);
    });
    this.beneficiaryFormGroup = new FormGroup(this.beneficiaryGroup);
  }

  onSubmit(data) {}

  viewAll() {}

}
