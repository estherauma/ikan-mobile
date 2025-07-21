import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { FieldType, Icons, LoginSuccessReponse, StorageKeys, UserData, UserRole } from 'src/app/shared/types/api-types';
import { DBService } from 'src/app/shared/services/database/db.service';
import { SyncService } from 'src/app/shared/services/sync/sync.service';
import { LocalNotificationsService } from 'src/app/shared/services/local-notifications/local-notifications.service';
import { LocalNotifications  } from '@capacitor/local-notifications';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { PushNotificationsService } from 'src/app/shared/services/push-notifications/push-notifications.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends BaseformPage implements OnInit {
  passwordFieldType = FieldType.password;
  passwordEyeIcon = Icons.iconEyeClosed;
  testEmails;
  pageText: any;

  constructor(
    public contentService: ContentService,
    public menuCtrl: MenuController,
    public apiServices: ApiService,
    public sharedMethods: SharedmethodsService,
    public router: Router,
    public authService: AuthService,
    public dbService: DBService,
    public syncService: SyncService,
    public localNotifications: LocalNotificationsService,
    public modalController: ModalController,
    public analytics: AnalyticsService,
    public pushNotificationsService: PushNotificationsService,
  ) {
    super(contentService);
  }

  ngOnInit() {
    this.pageSetup();
    this.analytics.trackEvent(PageEventNames.login, this.sharedMethods.analyticsEventParams);
  }

  pageSetup() {
    const pageData = this.contentService.getLoginPageData();
    this.formQuestions = pageData.formQuestions;
    this.pageTitle = pageData?.pageTitle;
    this.pageText = this.sharedMethods?.convertAdditionalTextToObj(pageData?.additionalText);
    this.submitButtonText = this.pageText?.submitButtonText;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
      if (entry.key === 'password') {
        this.group[entry.key] = new FormControl('', [Validators.required]);
      }

      if (entry.key === 'email') {
        this.group[entry.key] = new FormControl('', [Validators.required, Validators.email]);
      }
    });
    this.pageFormGroup = new FormGroup(this.group);
    this.testEmails = this.dbService.testEmails;

    this.pageFormGroup.valueChanges.subscribe((data) => {
      if (data.email) {
        this.pageFormGroup.controls.email.setValue(data.email.trim(), { emitEvent: false });
      }
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  setUpForm(): void {}

  async onSubmit(formData) {
    formData = {
      ...formData,
      email: formData.email.trim(),
      password: formData.password.trim()
    };

    this.sharedMethods.showLoader(this.contentService.commonText?.loadingText);
    const response = await this.apiServices.post('accounts/login', formData, true);
    response.subscribe(
      async(res: LoginSuccessReponse) => {
        if (res.status === 'OK') {
          this.pageFormGroup.reset();
          await this.sharedMethods.saveDataToStorage(StorageKeys.apiToken, res.data.token);
          await this.sharedMethods.saveDataToStorage(StorageKeys.userData, res.data.userData);

          // set api headers for sync service that requires saved token
          await this.apiServices.setApiRequestHeaders();
          await this.authService.setUpAuthData();
          await this.contentService.updateAllContent();
          this.sharedMethods.hideLoader();

          // get contract access
          this.contentService.getUserContractViewAccess();

          // setup push notifications
          await this.pushNotificationsService.setup();

          // setup/reset local notifications
          await LocalNotifications.removeAllListeners();
          this.localNotifications.addListeners();
          this.localNotifications.scheduleNotifications(this.contentService.commonText);

          // sync data
          await this.sharedMethods.showWaitLoader(this.commonText?.syncingData || 'Syncing data...');
          await this.syncService.syncData();
          await this.sharedMethods.dismissLoader();

          // enable menu
          this.menuCtrl.enable(true);
          if (this.testEmails.includes(res.data.userData?.email)) {
            this.dbService.checkDbPlatformAndRunMigration(true);
          }
          // select role if user has multiple roles
          if (res.data.userData?.roles?.length > 1) {
            return this.router.navigate(['select-role'], { replaceUrl: true });
          }

          // show app tutorials if not seen or skipped
          await this.showAppTutorials();

          await this.sharedMethods.saveDataToStorage(StorageKeys.isRoleSet, true);
          this.handleRedirection(res.data.userData?.role);
        }
      }, (err: HttpErrorResponse) => {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(err.error?.detail);
      }
    );
  }

  async showAppTutorials() {
    const skippedAppTutorials = await this.sharedMethods.readDataFromStorage(StorageKeys.skippedAppTutorials);
    const seenAppTutorials = await this.sharedMethods.readDataFromStorage(StorageKeys.seenAppTutorials);
    if (!skippedAppTutorials && !seenAppTutorials) {
      this.router.navigate(['app-tutorials']);
    }
  }


  async handleRedirection(role) {
    const helpScreens = await this.sharedMethods.readDataFromStorage(StorageKeys.isFirstLogin);
    const user: UserData = await this.sharedMethods.readDataFromStorage(StorageKeys.userData);
    if (!helpScreens) {
      this.router.navigate([this.authService.getCurrentUserBaseUrlFromRole(role)], { replaceUrl: true });
    } else {
      this.router.navigate([this.authService.getCurrentUserBaseUrlFromRole(role)], { replaceUrl: true });
    }
  }

  changePasswordFieldState() {
    this.passwordFieldType = (this.passwordFieldType === FieldType.password) ? FieldType.text : FieldType.password;
    this.passwordEyeIcon = (this.passwordEyeIcon === Icons.iconEyeClosed) ? Icons.iconEyeOpen : Icons.iconEyeClosed;
  }

  goBack() {
    this.router.navigate(['auth/login-method'], { replaceUrl: true });
  }
}
