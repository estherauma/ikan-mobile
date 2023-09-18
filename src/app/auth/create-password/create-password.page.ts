import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.page.html',
  styleUrls: ['./create-password.page.scss'],
})
export class CreatePasswordPage extends BaseformPage implements OnInit {
  title='';
  description = '';
  submitButtonText = '';
  pageText: any;

  constructor(
    public contentService: ContentService,
    public router: Router,
    public sharedMethods: SharedmethodsService,
  ) {
    super(contentService);
  }

  ngOnInit() {
    this.pageSetup();
  }

  pageSetup() {
    const pageData = this.contentService.getContentByPropertyName('createpassword');
    this.formQuestions = pageData.formQuestions;
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.title = pageData?.pageTitle;
    this.submitButtonText = this.pageText?.submitButtonText;
    this.description = this.pageText?.description;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  onSubmit(data) {
    this.router.navigate(['/auth/password-reset-success']);
  }

}
