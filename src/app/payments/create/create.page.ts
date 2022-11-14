import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage extends BaseformPage implements OnInit  {
  pageTitle = '';
  submitButtonText = 'Record payment';
  tempOptions = [
    {
      name: 'Option One',
      value: 'Option One',
      label: 'Option One',
    },
    {
      name: 'Option Two',
      value: 'Option Two',
      label: 'Option Two',
    },
  ];

  constructor(
    public contentServ: ContentService,
  ) {
    super(contentServ);
    const pageData = this.contentServ.getContentByPropertyName('payment-create');
    this.pageTitle  = pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach(entry => {
      if (entry.questionType === 'select') {
        entry.options = this.tempOptions;
      }
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);

    // This is for the deductions on each payment
    const deductionsData = this.contentServ.getContentByPropertyName('payment-deductions');
    let deductionsFormGroup = new FormGroup({});
    const deductionsGroup = {};
    const deductionQuestions = deductionsData?.formQuestions;
    deductionQuestions.forEach((q) => {
      if (q.questionType === 'select') {
        q.options = this.tempOptions;
      }
      deductionsGroup[q.key] = new FormControl('', [Validators.required]);
    });
    deductionsFormGroup = new FormGroup(deductionsGroup);
  }

  ngOnInit() {
  }

  onSubmit(formValue) {
  }
}
