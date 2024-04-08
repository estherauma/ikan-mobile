import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-createpassport',
  templateUrl: './createpassport.page.html',
  styleUrls: ['./createpassport.page.scss'],
})

export class CreatepassportPage extends BaseformPage implements OnInit {

  submitButtonText = 'Submit for review';
  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public router: Router
  ) {
    super(contentService);
    const pageData = this.contentService.getContentByPropertyName('createpassport');
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  onSubmit(formData) {
    this.router.navigate(['/mydocuments/home']);
  }

}
