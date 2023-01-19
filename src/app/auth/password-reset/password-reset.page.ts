import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage extends BaseformPage implements OnInit {

  title='Forgot Password';
  description = 'feugiat id volutpat eu, laoreet ac orci. Phasellus sodales feugiat luctus. Sed hendrerit neque ut ante imperdiet';
  submitButtonText = 'Reset Password';

  constructor(
    public contentService: ContentService,
    public router: Router
  ) {
    super(contentService);
    const pageData = this.contentService.getContentByPropertyName('passwordresetform');
    this.formQuestions = pageData.formQuestions;
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {
  }

  onSubmit(data){
    this.router.navigate(['auth/create-password']);
  }

}
