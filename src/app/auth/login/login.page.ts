import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    const pageData = this.contentService.getLoginPageData(this.contentService.appContent);
  }

  ngOnInit() {
    this.pageFormGroup = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    });
  }

  checkUserLoginStatus() {
  }

  setUpForm(): void {
  }

  onSubmit(event) {
  }

}
