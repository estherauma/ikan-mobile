import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { LoginSuccessReponse, StorageKeys, UserData, UserRole } from 'src/app/shared/types/api-types';
import { DBService } from 'src/app/shared/services/database/db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends BaseformPage implements OnInit {
  submitButtonText: string;

  constructor(
    public contentService: ContentService,
    public menuCtrl: MenuController,
    public apiServices: ApiService,
    public sharedMethods: SharedmethodsService,
    public router: Router,
    public authService: AuthService,
    // public dbService: DBService
  ) {
    super(contentService);
    const pageData = this.contentService.getLoginPageData();
    this.formQuestions = pageData.formQuestions;
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('asdfasldfjlasdjfsad', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {
    this.submitButtonText = this.contentService.commonText?.login;
    this.submitButtonText = 'Log in';
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  setUpForm(): void {}

  async onSubmit(formData) {
    this.sharedMethods.showLoader(this.contentService.commonText?.loadingText);
    const response = await this.apiServices.post('accounts/login/', formData);
    response.subscribe(
      async(res: LoginSuccessReponse) => {
        if (res.status === 'OK') {
          this.pageFormGroup.reset();
          await this.sharedMethods.saveDataToStorage(StorageKeys.apiToken, res.data.token);
          await this.sharedMethods.saveDataToStorage(StorageKeys.userData, res.data.userData);
          const decodedToken = this.authService.decodeAccessToken(res.data.token);
          await this.sharedMethods.saveDataToStorage(StorageKeys.apiTokenExpiry, decodedToken.exp);
          this.sharedMethods.hideLoader();
          this.handleRedirection();
        }
      }, (err: HttpErrorResponse) => {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(err.error?.detail);
      }
    );
  }

  async handleRedirection() {
    const helpScreens = await this.sharedMethods.readDataFromStorage(StorageKeys.isFirstLogin);
    const user: UserData = await this.sharedMethods.readDataFromStorage(StorageKeys.userData);
    if (!helpScreens) {
      this.router.navigate([this.authService.getCurrentUserBaseUrlFromRole(user.role)]);
    } else {
      this.router.navigate([this.authService.getCurrentUserBaseUrlFromRole(user.role)]);
    }
  }
}
