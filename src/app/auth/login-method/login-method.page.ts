import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SelectLanguageComponent } from 'src/app/shared/components/select-language/select-language/select-language.component';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys } from 'src/app/shared/types/api-types';

@Component({
    selector: 'app-login-method',
    templateUrl: './login-method.page.html',
    styleUrls: ['./login-method.page.scss'],
    standalone: false
})
export class LoginMethodPage implements OnInit {
  
  commonText: any;
  pageText: any;
  pageTitle = 'Login Method';
  // inviteCodeAuth, usernameAuth, login & register initialized with values for
  // the first few seconds before content is fetched from the api
  inviteCodeAuth: string = 'I have an invite code';
  loginWithEmailOrPhoneNumberText: string = 'Login with email or phone number';
  loginText: string = 'Login';
  registerText: string = 'Register';
  watchContent: Subscription;
  langModalPresented = false;
  modalDisplaying = false;

  constructor(
    public router: Router,
    public contentService: ContentService,
    public modalController: ModalController,
    public sharedMethods: SharedmethodsService,
    public analytics: AnalyticsService
  ) {
    this.watchContent = this.contentService.watchContent().subscribe(async(resp) => {
      if (resp) {
        this.getAuthText();
        if (!(await this.savedCurrentLanguage()) && !this.langModalPresented && !this.modalDisplaying) {
          await this.presentSelectLangModal();
          this.langModalPresented = true;
        }
      }
    });
  }

  async ngOnInit() {
    this.commonText = this.contentService.commonText;
    if (this.commonText && Object.keys(this.commonText).length > 0) {
      this.loginText = this.commonText?.login || this.loginText;
      this.registerText = this.commonText?.register || this.registerText;
    }
    const pageData = this.contentService.getContentByPropertyName('login-method');
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    if (this.pageText && Object.keys(this.pageText).length > 0) {
      this.inviteCodeAuth = this.pageText?.inviteCodeAuth || this.inviteCodeAuth;
      this.loginWithEmailOrPhoneNumberText = this.pageText?.loginWithEmailOrPhoneNumberText || this.loginWithEmailOrPhoneNumberText;

      if (!(await this.savedCurrentLanguage())) {
        await this.presentSelectLangModal();
        this.langModalPresented = true;
      }
    }
    this.analytics.trackEvent(PageEventNames.loginMethod, this.sharedMethods.analyticsEventParams);
  }

  getAuthText() {
    const pageData = this.contentService.getContentByPropertyName('login-method');
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.inviteCodeAuth = this.pageText?.inviteCodeAuth;
    this.loginWithEmailOrPhoneNumberText = this.pageText?.loginWithEmailOrPhoneNumberText;
  }

  goToInviteCodeScreen() {
    this.router.navigate(['auth/invite-code']);
  }

  goToLoginScreen() {
    this.router.navigate(['login'], {replaceUrl: true});
  }

  goToSignupScreen() {
    this.router.navigate(['auth/signup'], {replaceUrl: true});
  }

  async presentSelectLangModal() {
    this.modalDisplaying = true;
    const modal = await this.modalController?.create({
      component: SelectLanguageComponent,
      cssClass: 'select-lang-modal',
      backdropDismiss: true,
      showBackdrop: true,
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.pageText = data.data?.loginMethodData;
        this.inviteCodeAuth = this.pageText?.inviteCodeAuth;
        this.loginWithEmailOrPhoneNumberText = this.pageText?.loginWithEmailOrPhoneNumberText;
        this.loginText = this.commonText?.login || this.loginText;
        this.registerText = this.commonText?.register || this.registerText;
      }
      this.modalDisplaying = false;
    });

    await modal.present();
  }

  async savedCurrentLanguage() {
    const currentLanguage = await this.sharedMethods.readDataFromStorage(StorageKeys.currentLanguage);
    if (currentLanguage) {
      return true;
    }
    return false;
  }
}
