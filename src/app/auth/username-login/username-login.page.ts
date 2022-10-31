import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-username-login',
  templateUrl: './username-login.page.html',
  styleUrls: ['./username-login.page.scss'],
})
export class UsernameLoginPage extends BaseformPage implements OnInit {

  submitButtonText = "LOGIN"
  
  constructor(
    contentService: ContentService
  ) { 
    super(contentService);
    const pageData = this.contentService.getUsernameLoginPageData();
    this.formQuestions = pageData.formQuestions;
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {
  }

  onSubmit(loginData){
    console.log("loginData:", loginData)
  }

}
