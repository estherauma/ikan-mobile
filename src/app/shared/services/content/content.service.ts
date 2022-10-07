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

  async compareContent() {
    const appContent = await this.readLocalContent();
    if(!appContent) return;
    
    const current_content_created_at =  appContent.createdAt
    const response = this.apiService.get(`content/compare?app_content_created_at=${current_content_created_at}`)
    response.subscribe((res: HttpResponse<any>) => {
      const content = res.body;
      
      if (content?.status === 'OK' && content.new) {
        console.log("new data")
        this.writeLocalContent(StorageKeys.appContent, content.data[0]);
        return this.appContent = content.data[0].content;
      }
    })
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
    const content = this.appContent?.[`${this.currentLanguage}`];
    const  { loginform } = content;
    return loginform;
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

  getMenuContent(){
    const content = this.appContent?.[`${this.currentLanguage}`];
    const { sidemenu } = content;
    const menu = [];
    for (const menuItem of sidemenu?.data ) {
      menu.push(menuItem);
    }
    return menu;
  }
}
