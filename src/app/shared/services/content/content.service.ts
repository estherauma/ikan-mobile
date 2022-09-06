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
  defaultLangauge: string;

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

  // ToDo: Refactor to use shared method function
  async readLocalContent() {
    const { value } = await Preferences.get({ key: StorageKeys.appContent });
    return JSON.parse(value);
  }

  // ToDo: Refactor to use shared method
  async writeLocalContent(key, content) {
    Preferences.set({
      key,
      value: JSON.stringify(content),
    });
  }

  getLoginPageData(language='en-us') {
    // setting default language to english.
    // ToDo. Add logic to pass different languages;
    const content = this.appContent?.['en-us'];
    const  { loginform } = content;
    return loginform;
  }

}
