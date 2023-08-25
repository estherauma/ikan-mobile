import { Component, OnInit } from '@angular/core';
import { ContentService } from '../shared/services/content/content.service';
import { SharedmethodsService } from '../shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys, UserData } from '../shared/types/api-types';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth/auth.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {
  currentLanguage = 'en-us';
  availableLanguages = [];
  pageTitle: string;

  constructor(
    public contentServ: ContentService,
    public router: Router,
    public authService: AuthService,
    public sharedMethods: SharedmethodsService
  ) {
    this.getAvailableLanguages();
    this.sharedMethods.readDataFromStorage(StorageKeys.currentLanguage)
    .then((data) => {
      if (data != null) {
        this.currentLanguage = data;
      }
    });
  }

  ngOnInit() {
  }

  getAvailableLanguages() {
    const data = this.contentServ.getAvailableLanguages();
    const {languages, pageTitle} = data;
    this.pageTitle = pageTitle;
    this.availableLanguages = languages;
  }


  async changeLanguage(selectedLanguage) {
    this.sharedMethods.saveDataToStorage(StorageKeys.currentLanguage,selectedLanguage?.detail?.value);
    const user: UserData = await this.sharedMethods.readDataFromStorage(StorageKeys.userData);
    await this.contentServ.updateCurrentLanguage();
    this.router.navigate([this.authService.getCurrentUserBaseUrlFromRole(user.role)]);
  }
}
