import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { element } from 'protractor';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends BaseformPage implements OnInit {


  constructor(
    public contentService: ContentService
  ) {
    super();
    const language = 'en-en';
    const pageData = this.contentService.getLoginPageData(language);
    this.formQuestions = pageData.formQuestions;
    this.formQuestions.forEach(entry => {
      this.group[entry.key] = new FormControl('');
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {

  }

  checkUserLoginStatus() {
  }

  setUpForm(): void {
  }

  onSubmit(event) {
  }

}
