import { Injectable } from '@angular/core';
import { Content, StorageKeys } from '../../types/api-types';
import { ApiService } from '../api/api.service';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';
import { Preferences } from '@capacitor/preferences';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  appContent: Content;
  currentLanguage: string;

  constructor(
    public apiService: ApiService,
    public sharedMethods: SharedmethodsService
  ) {
    this.setUpAppData();
  }

  async setUpAppData() {
    const appContent = await this.readLocalContent();
    if (appContent == null || appContent === undefined) {
      await this.fetchContent();
    } else {
      const result = await this.readLocalContent();
      this.appContent = result?.content;
      this.updateCurrentLanguage();
    }
  }

  async fetchContent() {
    const response = this.apiService.get('content/aggregated');
    response.subscribe((res: HttpResponse<any>) => {
      const content = res.body;
      if (content?.status === 'OK') {
        this.writeLocalContent(StorageKeys.appContent, content.data[0]);
        this.appContent = content.data[0].content;
      }
    });
  }

  updateCurrentLanguage() {
    this.sharedMethods.readDataFromStorage(StorageKeys.currentLanguage)
    .then((data) => {
      if (data != null) {
        this.currentLanguage = data;
      } else {
        this.currentLanguage = 'en-us';
      }
    });
  }

  // TODO: Refactor to use shared method function
  async readLocalContent() {
    const { value } = await Preferences.get({ key: StorageKeys.appContent });
    return JSON.parse(value);
  }

  // TODO: Refactor to use shared method
  async writeLocalContent(key, content) {
    Preferences.set({
      key,
      value: JSON.stringify(content),
    });
  }

  getLoginPageData(language=this.currentLanguage) {
    // setting default language to english.
    // TODO. Add logic to pass different languages;
    const content = this.appContent?.[`${this.currentLanguage}`];
    const  { loginform } = content;
    return loginform;
  }

  getAvailableLanguages(language='en-us') {
    const content = this.appContent?.[`${this.currentLanguage}`];
    const { languages } = content;
    return languages.data;
  }
}
