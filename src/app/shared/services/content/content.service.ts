import { Injectable } from '@angular/core';
import { Content, StorageKeys } from '../../types/api-types';
import { ApiService } from '../api/api.service';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';
import { Preferences } from '@capacitor/preferences';
import { HttpResponse } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  public contentObs = new Subject<boolean>();
  watchContentSubscription: Subscription;
  appContent: Content;
  currentLanguage: string = 'en-us';
  commonText: any;
  menuContent = new Subject<any>();

  constructor(
    public apiService: ApiService,
    public sharedMethods: SharedmethodsService,
    public authService: AuthService
  ) {
    this.setUpAppData();
    this.watchContentSubscription = this.watchContent().subscribe(async(res) => {
      if (res) {
        await this.updateAllContent();
      }
    });
    this.saveSurveyCategories();
  }

  async updateAllContent() {
    await this.setAppContent();
    await this.updateCommonText();
    await this.updateSideMenu();
  }

  async setUpAppData() {
    const appContent = await this.readLocalContent();
    if (appContent == null || appContent === undefined) {
      await this.fetchContent();
      // Read the content again after fetching it and saving it to storage
      await this.setAppContent();
    } else {
      await this.setAppContent();
    }
  }

  async setAppContent() {
    const result = await this.readLocalContent();
    this.appContent = result?.content;
    await this.updateCurrentLanguage();

  }

  async currentContentCreateAt() {
    const appContent = await this.readLocalContent();
    return appContent?.createdAt;
  }

  async fetchContent() {
    const response = this.apiService.get('content/aggregated', true);
    response?.subscribe((res: HttpResponse<any>) => {
      const content = res.body;
      if (content?.status === 'OK') {
        this.writeLocalContent(StorageKeys.appContent, content.data[0]);
        this.appContent = content.data[0].content;
        
        this.contentObs.next(true);
      }
    });
  }

  async compareContent() {
    const currentContentCreateAt = await this.currentContentCreateAt();
    // ToDo: If device time is ahead of servertime, user will not get updated content
    // Provide fix for this
    if (currentContentCreateAt) {
      const response = this.apiService.get(`content/compare?app_content_created_at=${currentContentCreateAt}`, true);
      response.subscribe((res: HttpResponse<any>) => {
        const content = res.body;
        if (content?.status === 'OK' && content.new) {
          this.writeLocalContent(StorageKeys.appContent, content.data[0]);
          this.contentObs.next(true);
          this.appContent = content.data[0].content;
          this.updateSideMenu();
          return this.appContent;
        }
      });
    }
  }

  async updateCurrentLanguage() {
    const lang = await this.sharedMethods.readDataFromStorage(StorageKeys.currentLanguage);
    if (lang) {
      this.currentLanguage = lang;
      this.updateCommonText();
      this.updateSideMenu();
    } 
  }

  updateCommonText() {
    this.commonText = this.getCommonText();
  }

  async updateSideMenu() {
    const updatedContent = await this.getMenuContent();
    this.menuContent.next(updatedContent);
  }

  async readLocalContent() {
    return await this.sharedMethods?.readDataFromStorage(StorageKeys.appContent);
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
    const languages = content?.languages;
    return {languages: languages?.data, pageTitle: languages?.pageTitle};
  }

  getCommonText() {
    const content = this.appContent?.[`${this.currentLanguage}`];
    if (content != null || content !== undefined) {
      const { commonText } = content;
      const commonTextOject = {};
      for (const item of commonText.data) {
        commonTextOject[item.label] = item.value;
      }
      return commonTextOject;
    } else  {
      return { };
    }

  }

  async getMenuContent() {
    const content = this.appContent?.[`${this.currentLanguage}`];
    if (content != null || content !== undefined) {
      const { sidemenu } = content;
      const allMenuItems: Array<any> = sidemenu?.data;
      const menu = this.authService.alterMenuBasedOnRole(allMenuItems);

      return menu;
    } else {
      return [];
    }
  }

  getContentByPropertyName(propertyName) {
    const content = this.appContent?.[`${this.currentLanguage}`];
    return content?.[propertyName];
  }

  watchContent() {
    return this.contentObs.asObservable();
  }

  getSurveyData() {
    const content = this.appContent?.[`${this.currentLanguage}`];
    if (!content) return {};
    
    const allDocs: Array<any> = Object.values(content);
    const contentDocs = allDocs?.filter((doc) => (doc?.type === 'create_content_area' && !isNaN(doc?.pageName)));

    let result = {};
    contentDocs?.forEach((item) => {
      const qtns = item?.pageContent?.filter(x => x.type === 'questions');
      if (qtns?.length) {
        result[item?.pageName] = qtns;
      }
    });
    return result;
  }

  async saveSurveyCategories() {
    const surveyData = this.getSurveyData();
    const savedCategories = await this.sharedMethods.readDataFromStorage(StorageKeys.surveyCategories);
    if(!savedCategories || !savedCategories?.length) {
      const categories = Object.keys(surveyData);
      await this.sharedMethods.saveDataToStorage(StorageKeys.surveyCategories, categories);
      return categories;
    }
  }

  async getSurveyQuestions() {
    let allCategories;
    allCategories = await this.sharedMethods.readDataFromStorage(StorageKeys.surveyCategories);
    if(!allCategories?.length) {
      allCategories = await this.saveSurveyCategories();
    }
    
    // get random category
    // const randomIndex = Math.floor(Math.random() * allCategories.length);
    // const randomCategory = allCategories[randomIndex];
    const category = allCategories[0];
    const surveyData =  this.getSurveyData();
    
    return surveyData[category].map((qn) => ({
      category: null,
      displayquestion: true,
      helpText: qn?.helpText ?? null,
      key: qn.key,
      label: qn.question ?? '',
      placeholder: qn?.placeholder ?? null,
      questionType: qn.questionType,
      options: (qn.options ?? []).map(x => ({ label: x.option, value: x.option, ...x })),
    })) ?? [];
  }
}
