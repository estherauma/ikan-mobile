import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage extends BaseformPage implements OnInit {

  title='Create a login';
  description = 'feugiat id volutpat eu, laoreet ac orci. Phasellus sodales feugiat luctus. Sed hendrerit neque ut ante imperdiet';
  submitButtonText = 'Log in';

  constructor(
    public contentService: ContentService,
    public router: Router
  ) {
    super(contentService);
    const pageData = this.contentService.getContentByPropertyName('signup');
    this.formQuestions = pageData.formQuestions;
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {
  }
  onSubmit(data) {}

}
