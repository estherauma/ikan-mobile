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

      // We are using the email key and not emailOrPhone for backward compatibility
      // with the old login page
      if (entry.key === 'email') {
        entry.label = this.pageText?.emailOrPhoneLabel ?? entry.label;
        this.group[entry.key] = new FormControl('', [Validators.required, this.emailOrPhoneValidator]);
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

  emailOrPhoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) { return null; }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^([+]?[\s0-9 ]+)?(\d{3}|[ (]?[0-9]+[) ])?([- ]?[\s]?[0-9])+$/;

    const isEmail = value.match(emailPattern);
    const isPhone = value.match(phonePattern);

    // We are using the email key and not emailOrPhone for backward compatibility
    // with the old login page
    return isEmail || isPhone ? null : { email: true };
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  setUpForm(): void {}

  async onSubmit(formData) {
    this.sharedMethods.showLoader(this.contentService.commonText?.loadingText);
    // We are using the email key and not emailOrPhone for backward compatibility
    // with the old login page
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // const phonePattern = /^([+]?[\s0-9 ]+)?(\d{3}|[ (]?[0-9]+[) ])?([- ]?[\s]?[0-9])+$/;
    const phonePattern = /^\+[1-9]\d{1,14}$/;
    const isEmail = formData.email.trim().match(emailPattern);
    const isPhone = formData.email.trim().match(phonePattern);
    if (!isEmail && !isPhone) {
      this.sharedMethods.hideLoader();
      this.sharedMethods.showToast(this.pageText?.noEmailOrPhoneError || 'Please enter a valid email or phone number');
      return;
    }

    // Extract email or phone number from formData
    let email = null;
    let phoneNumber = null;
    if (isEmail) {
      email = formData.email.trim();
    }
    if (isPhone) {
      phoneNumber = formData.email.trim();
    }

    formData = {
      ...formData,
      email,
      phoneNumber,
      password: formData.password.trim()
    };
    
    // Remove fields with null values
    Object.keys(formData).forEach(key => {
      if (formData[key] === null) {
        delete formData[key];
      }
    });

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
          await this.sharedMethods.showWaitLoader(this.contentService.commonText?.syncingData || 'Syncing data...');
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

          await this.sharedMethods.saveDataToStorage(StorageKeys.isRoleSet, true);
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

  async handleRedirection(role) {
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
      `),
      cssClass: 'tuna-alert unverified-phone-number-alert',
      buttons: [
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
