import { Injectable } from '@angular/core';
import { Content, StorageKeys } from '../../types/api-types';
import { ApiService } from '../api/api.service';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';
import { Preferences } from '@capacitor/preferences';
import { HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  appContent: Content;
  currentLanguage: string;
  commonText: any;
  menuContent = new Subject<any>();

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
      // Read the content again after fetching it to ensure the app doesn't crash
      const result = await this.readLocalContent();
      this.appContent = result?.content;
      this.updateCurrentLanguage();
    } else {
      const result = await this.readLocalContent();
      this.appContent = result?.content;
      this.updateCurrentLanguage();
    }
  }

  async currentContentCreateAt() {
    const appContent = await this.readLocalContent();
    return appContent?.createdAt;
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

  async compareContent() {
    const currentContentCreateAt = await this.currentContentCreateAt();

    const response = this.apiService.get(`content/compare?app_content_created_at=${currentContentCreateAt}`);
    response.subscribe((res: HttpResponse<any>) => {
      const content = res.body;

      if (content?.status === 'OK' && content.new) {
        this.writeLocalContent(StorageKeys.appContent, content.data[0]);
        return this.appContent = content.data[0].content;
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
      this.updateCommonText();
      this.updateSideMenu();
    });
  }

  updateCommonText() {
    this.commonText = this.getCommonText();
  }

  updateSideMenu() {
    const updatedContent = this.getMenuContent();
    this.menuContent.next(updatedContent);
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

  getLoginPageData() {
    if (this.appContent != null) {
      const content = this.appContent?.[`${this.currentLanguage}`];
      const  { loginform } = content;
      return loginform;
    } else {
      // When app content isn't available, default to this.
      // This happens only the first time when the app is opened
      // TODO: Find a better way to resolve this. Consider using observables
      return {
        pageName: 'loginform',
        pageTitle: 'Login',
        lastUpdated: '2022-09-23T07:55:22+0000',
        formQuestions: [
            {
                key: 'email',
                label: 'Email',
                options: null,
                helptext: null,
                questionType: 'textBox',
                displayquestion: true
            },
            {
                key: 'password',
                label: 'Password',
                options: null,
                helptext: null,
                questionType: 'password',
                displayquestion: true
            }
        ]
      };
    }

  }

  getAvailableLanguages() {
    const content = this.appContent?.[`${this.currentLanguage}`];
    const { languages } = content;
    return {languages: languages.data, pageTitle: languages.pageTitle};
  }

  getCommonText() {
    const content = this.appContent?.[`${this.currentLanguage}`];
    const { commonText } = content;
    const commonTextOject = {};
    for (const item of commonText.data) {
      commonTextOject[item.label] = item.value;
    }
    return commonTextOject;
  }

  getMenuContent() {
    const content = this.appContent?.[`${this.currentLanguage}`];
    const { sidemenu } = content;
    const menu = [];
    for (const menuItem of sidemenu?.data ) {
      menu.push(menuItem);
    }
    return menu;
  }

  getContentByPropertyName(propertyName) {
    const content = this.appContent?.[`${this.currentLanguage}`];
    return content[propertyName];
  }
}
