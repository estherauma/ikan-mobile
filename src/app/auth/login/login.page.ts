import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicSafeString, MenuController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { FieldType, Icons, LoginSuccessReponse, StorageKeys } from 'src/app/shared/types/api-types';
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
    standalone: false
})
export class LoginPage extends BaseformPage implements OnInit {
  
  passwordFieldType = FieldType.password;
  passwordEyeIcon = Icons.iconEyeClosed;
  testEmails: string[] = [];
  pageText: any;
  authCommonText: any;

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
    public alertController: AlertController,
  ) {
    super(contentService);
  }

  ngOnInit() {
    this.pageSetup();
    this.analytics.trackEvent(PageEventNames.login, this.sharedMethods.analyticsEventParams);
  }

  pageSetup() {
    this.commonText = this.contentService.commonText;
    const authPageData = this.contentService.getContentByPropertyName('auth-common-text');
    this.authCommonText = this.sharedMethods.convertAdditionalTextToObj(authPageData?.additionalText);
    const pageData = this.contentService.getLoginPageData();
    this.formQuestions = pageData.formQuestions;
    this.pageTitle = pageData?.pageTitle;
    this.pageText = this.sharedMethods?.convertAdditionalTextToObj(pageData?.additionalText);
    this.submitButtonText = this.pageText?.submitButtonText;
    this.formQuestions.forEach((entry: any) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
      if (entry.key === 'password') {
        this.group[entry.key] = new FormControl('', [Validators.required]);
      }

      // We are using the email key and not emailOrPhone for backward compatibility
      // with the old login page
      if (entry.key === 'email') {
        entry.label = this.authCommonText?.emailOrPhoneLabel ?? entry.label;
        this.group[entry.key] = new FormControl('', [Validators.required, this.sharedMethods.emailOrPhoneValidator]);
      }
    });
    this.pageFormGroup = new FormGroup(this.group);
    this.sharedMethods.trimFormValues(this.pageFormGroup);

    this.testEmails = this.dbService.testEmails;
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  setUpForm(): void {}

  async onSubmit() {
    let formData = this.pageFormGroup.value;
    this.sharedMethods.showLoader(this.contentService.commonText?.loadingText);
    
    // TODO: change to authcommon text
    formData = this.sharedMethods.aggregateEmailOrPhoneValue(formData, this.authCommonText);
    formData.language = this.contentService?.currentLanguage || 'en-us';

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

          // enable menu
          this.menuCtrl.enable(true);
          if (this.testEmails.includes(res.data.userData?.email)) {
            this.dbService.checkDbPlatformAndRunMigration(true);
          }
          // select role if user has multiple roles
          if (res.data.userData?.roles && res.data.userData?.roles?.length > 1) {
            return this.router.navigate(['select-role'], { replaceUrl: true });
          }

          // set role-set flag
          await this.sharedMethods.saveDataToStorage(StorageKeys.isRoleSet, true);

          // sync data
          await this.sharedMethods.showWaitLoader(this.contentService.commonText?.syncingData || 'Syncing data...');
          await this.syncService.syncData();

          // generate learning hub progress data
          // This should be after the sync to ensure that we have the latest progress data from the server.
          // This will only generate data if it doesn't already exist.
          await this.contentService.generateLearningHubProgressData();
          
          await this.sharedMethods.dismissLoader();
          
          // redirect to dashboard based on role
          // this is the last step. All other logic should be executed before this
          this.handleRedirection(res.data.userData?.role);
        }
      }, async(err: HttpErrorResponse) => {
        await this.sharedMethods.hideLoader();
        if (err.error?.detail === 'Your phone number is not verified. Please verify it before logging in. OR log in with email.') {
          await this.showUnverifiedNumberAlert();
        } else {
          console.error('Login error: ', err);
          this.sharedMethods.showToast(err.error?.detail);
        }
      }
    );
  }

  async handleRedirection(role: any) {
    const helpScreens = await this.sharedMethods.readDataFromStorage(StorageKeys.isFirstLogin);
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

  async showUnverifiedNumberAlert() {
    const alert = await this.alertController.create({
      header: this.pageText?.unverifiedNumber,
      message:  new IonicSafeString(`
        <p style="text-align: center;">${ this.pageText?.unverifiedNumberMessage }</p>
        <p style="text-align: center;"><strong>${ this.pageText?.unverifiedNumberSubText }</strong></p>
        <p style="text-align: center; text-transform: uppercase; margin: 10px 0;">${ this.commonText?.or || 'OR' }</p>
        <p style="text-align: center;">${ this.authCommonText?.clickVerifyButtonText }</p>
      `),
      cssClass: 'tuna-alert unverified-phone-number-alert',
      buttons: [
        {
          text: this.commonText?.verify,
          cssClass: 'verify-btn',
          handler: () => {
            this.router.navigate(['/auth/verify-phone-number'], { queryParams: { previousUrl: this.router.url } });
          }
        },
        {
          text: this.contentService.commonText?.ok,
          role: 'cancel',
          cssClass: 'cancel-btn',
        },
      ]
    });

    await alert.present();
  }
}
