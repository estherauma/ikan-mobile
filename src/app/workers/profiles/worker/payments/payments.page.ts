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
  constructor(
    public contentService: ContentService
  ) {
    super(contentService);
    const pageData = this.contentService.getContentByPropertyName('createplacementinfo');
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.submitButtonText = this.commonText?.saveChanges;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {}

  onSubmit(data) {}

  viewAll() {}

}
