import { Injectable } from '@angular/core';
import { Content, StorageKeys, UserRole } from '../../types/api-types';
import { ApiService } from '../api/api.service';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';
import { Preferences } from '@capacitor/preferences';
import { HttpResponse } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { GetContractsResponse } from '../sync/types';
import { VesselsDataService } from 'src/app/vessels/data/vessels-data.service';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  public contentObs = new Subject<boolean>();
  watchContentSubscription: Subscription;
  appContent: Content;
  currentLanguage = 'en-us';
  commonText: any;
  menuContent = new Subject<any>();
  currentSurveyCategory = '';

  constructor(
    public apiService: ApiService,
    public sharedMethods: SharedmethodsService,
    public authService: AuthService,
    public vesselsDataService: VesselsDataService,
  ) {
    this.setUpAppData();
    this.watchContentSubscription = this.watchContent().subscribe(async(res) => {
      if (res) {
        await this.updateAllContent();
        await this.replaceVesselPlaceholderText();
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
    }
    await this.setAppContent();
    await this.updateCommonText();
    await this.updateSideMenu();
  }

  async setAppContent() {
    const result = await this.readLocalContent();
    this.appContent = result?.content;
    await this.updateCurrentLanguage();
    await this.addQuestionOptionValues();
  }

  async currentContentCreateAt() {
    const appContent = await this.readLocalContent();
    return appContent?.createdAt;
  }

  async fetchContent() {
    const response = this.apiService.get('content/aggregated', true);
    response?.subscribe((res: HttpResponse<any>) => {
      const result = res.body;
      if (result?.status === 'OK') {
        // filter out old learning hub content
        const formattedContent = this.formatContent(result.data[0]);
        this.writeLocalContent(StorageKeys.appContent, formattedContent);
        this.appContent = formattedContent.content;

        this.contentObs.next(true);
      }
    });
  }

  async compareContent() {
    const currentContentCreateAt = await this.currentContentCreateAt();
    // ToDo: If device time is ahead of servertime, user will not get updated content
    // Provide fix for this
    if (currentContentCreateAt) {
      const endPoint = `content/compare?app_content_created_at=`;
      const finalEndpoint = endPoint + encodeURIComponent(currentContentCreateAt);
      const response = this.apiService.get(finalEndpoint, true);
      response.subscribe((res: HttpResponse<any>) => {
        const result = res.body;
        if (result?.status === 'OK' && result.new) {
          // filter out old learning hub content
          const formattedContent = this.formatContent(result.data[0]);
          this.writeLocalContent(StorageKeys.appContent, formattedContent);
          this.appContent = formattedContent.content;
          this.updateSideMenu();
          this.contentObs.next(true);
          return this.appContent;
        }
      });
    }
  }

  formatContent(item: any) {
    const formattedContent: any = {};
    Object.entries(item.content).forEach(([lang, docsObj]: [string, any]) => {
      const docsList = Object.values(docsObj);
      // Filter out old learning hub docs as they aren't used anymore
      const filteredDocsList = docsList.filter((doc: any) => (
        !(doc?.type === 'create_content_area' && !isNaN(parseFloat(doc?.pageName))) &&
        !(doc?.type === 'sub_chapter_list' && !isNaN(parseFloat(doc?.pageName)))
      ));
      const formattedDocsObj = {};
      filteredDocsList.forEach((doc: any) => {
        if (
          doc?.type === 'learning_hub_subchapter' ||
          (doc?.type === 'learning_hub_subchapter_list' && doc?.pageName !== 'learning-hub-chapters-list')
        ) {
          // We are changing the pageName to the chapter/subchapter so to be able to use existing logic
          // So in the filtering above we are removing the old docs and replacing them here
          const pageId = doc?.pageName?.split('-')?.length > 1 ? doc?.pageName?.split('-')?.[1] : doc?.pageName;
          formattedDocsObj[pageId] = { ...doc, pageName: pageId };
        } else {
          doc.pageName ? formattedDocsObj[doc.pageName] = doc : formattedDocsObj[doc.uid] = doc;
        }
      });
      formattedContent[lang] = formattedDocsObj;
    });

    return {
      content: formattedContent,
      createdAt: item.createdAt,
    };
  }

  // TODO: update when worker has multiple contracts
  async replaceVesselPlaceholderText() {
    if (this.authService.userRole === UserRole.worker) {
      const userVessel = await this.vesselsDataService.getWorkerVessel();
      if (userVessel && userVessel?.name) {
        Object.entries(this.appContent).forEach(([lang, data]) => {
          const vesselDoc = data['1.9'];
          if (vesselDoc) {
            const vesselQtn = vesselDoc?.pageContent?.find(
              (item) => item?.type === 'questions' && item.key === 'is_this_the_vessel_you_are_working_on_the_one_you_were_assigned_to'
            );

            if (vesselQtn) {
              vesselQtn.question = vesselQtn.question.replace('[vessel_name_from_system]', userVessel?.name.toUpperCase());
            }
          }
        });
      }
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
                label: 'Email or Phone number',
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
      const commonText = content?.commonText;
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
    if (!content) {return {};}

    const allDocs: Array<any> = Object.values(content);
    const contentDocs = allDocs?.filter((doc) => (
      (doc?.type === 'create_content_area' && doc?.pageName.includes('ikan-feedback')) ||
      doc?.type === 'learning_hub_subchapter'
    ));

    const result = {};
    contentDocs?.forEach(async(item) => {
      const qtns = item?.pageContent?.filter(x => x?.type === 'questions');
      if (qtns?.length) {
        result[item?.pageName] = qtns;
      }
    });
    return result;
  }

  async getAllCategories() {
    const surveyData = this.getSurveyData();
    const categories = Object.keys(surveyData);
    categories.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    return categories;
  }

  async saveSurveyCategories() {
    const savedCategories = await this.sharedMethods.readDataFromStorage(StorageKeys.surveyCategories);
    if (!savedCategories || !savedCategories?.length) {
      const categories = await this.getAllCategories();
      await this.sharedMethods.saveDataToStorage(StorageKeys.surveyCategories, categories);
    }
  }

  async getSurveyQuestions(surveyTopic: string = '') {
    let category = surveyTopic;
    if (!category) {
      let allCategories;
      allCategories = await this.sharedMethods.readDataFromStorage(StorageKeys.surveyCategories);
      if (!allCategories?.length) {
        allCategories = this.getAllCategories();
        await this.saveSurveyCategories();
      }

      // get random category
      // const randomIndex = Math.floor(Math.random() * allCategories.length);
      // const randomCategory = allCategories[randomIndex];
      category = allCategories[0];
    }
    this.currentSurveyCategory = category;
    const surveyData =  this.getSurveyData();

    return surveyData[category]?.map((qn) => ({
      category: null,
      displayquestion: qn?.displayquestion,
      helpText: qn?.helpText ?? null,
      key: qn.key,
      label: qn.question ?? '',
      placeholder: qn?.placeholder ?? null,
      questionType: qn.questionType,
      options: qn.options?.length ? qn.options.map(x => ({
        label: x.option,
        value: x.value,
        ...x
      })) : [],
    })) ?? [];
  }

  getPageFormQuestions(pageName: string) {
    const content = this.appContent?.[`${this.currentLanguage}`];
    const pageData = content?.[pageName];
    return pageData?.formQuestions;
  }

  getFormOptions(pageName: string, inputKey: string) {
    const formQuestions = this.getPageFormQuestions(pageName);
    const formQtn = formQuestions.find(x => x.key === inputKey);
    return formQtn?.options ?? [];
  }

  getFormOptionTranslation(pageName: string, inputKey: string, optionValue: string) {
    const options = this.getFormOptions(pageName, inputKey);
    if (!options.length) {return optionValue;}

    const opt = options.find(x => x.value === optionValue);
    return opt?.label ?? optionValue;
  }

  /**
   * Adds values to content_area question options
   * The options/labels are in the selected language
   * The values are in English irrespective of the selected language
   */
  addQuestionOptionValues() {
    const content = this.appContent?.[`${this.currentLanguage}`];
    const englishContent = this.appContent?.['en-us'];
    if (!content || !englishContent) {return;}

    const allDocs: Array<any> = Object.values(content);
    const allEnglishDocs: Array<any> = Object.values(englishContent);

    allDocs?.forEach((doc) => {
      if ((doc?.type === 'create_content_area' && doc?.pageName.includes('ikan-feedback')) || doc?.type === 'learning_hub_subchapter') {
        const englishDoc = allEnglishDocs.find(x => x?.pageName === doc?.pageName);
        if (!englishDoc) {return;}

        doc?.pageContent?.forEach((section) => {
          if (section?.type === 'questions') {
            section?.options?.forEach((opt, i) => {
              const englishOptions = englishDoc?.pageContent?.find(x => x?.type === 'questions' && x?.key === section?.key)?.options;
              opt.value = englishOptions[i]?.option;
              if (opt?.followUpQuestion) {
                opt?.followUpQuestion?.options?.forEach((fOpt, j) => {
                  fOpt.value = englishOptions[i]?.followUpQuestion?.options[j]?.option;
                });
              }
            });
          }
        });
      }
    });
  }

  /**
   * returns untranslated inline question (english version)
   *
   * @param subChapterPageName
   * @param questionKey
   */
  getUntranslatedInlineQuestion(subChapterPageName: string, questionKey: string) {
    const englishContent = this.appContent?.['en-us'];
    if (!englishContent) {return null;}

    const englishDoc = englishContent?.[subChapterPageName];
    if (!englishDoc) {return null;}

    const qtn = englishDoc?.pageContent?.find(x => x?.type === 'questions' && x?.key === questionKey);
    return qtn;
  }

  getUntranlatedSurveyQuestion(pageName, questionKey) {
    const englishContent = this.appContent?.['en-us'];
    if (!englishContent) {return null;}

    const englishDoc = englishContent?.[pageName];
    if (!englishDoc) {return null;}

    const qtn = englishDoc?.formQuestions?.find(x => x?.key === questionKey);
    return qtn;
  }

  async getUserContractViewAccess() {
    return this.apiService.get('contracts').subscribe(async(response: GetContractsResponse) => {
      if (response.status === 200 && response.body.data.length > 0) {
        const userOnlineContracts = response.body.data.map((contract) => contract.appRef);
        await this.sharedMethods.saveDataToStorage(StorageKeys.currentUserOnlineContractsAppRefs, userOnlineContracts);
      }
    });
  }

  async generateLearningHubProgressData() {
    const savedLearningHubProgress = await this.sharedMethods.readDataFromStorage(StorageKeys.learningHubProgress);
    if (savedLearningHubProgress) { return; }

    const user = this.authService.userData;
    if (!user || !(await this.authService.checkAcessTokenValidity())) {
      return;
    }

    const chapterListPageData =  this.getContentByPropertyName('learning-hub-chapters-list');
    const clickableList = chapterListPageData?.pageContent?.find((e) => e.type === 'clickable_list');
    const chapters = clickableList?.list;
    const progressData = await Promise.all(chapters?.map(async(chapter) => {
      const chapterId = chapter?.page?.uid?.split('-')?.[1];
      const chapterContent = this.getContentByPropertyName(`chapter-${chapterId}`);
      const subChapterList = chapterContent?.pageContent?.[0]?.list;
      const subChapters = subChapterList?.map((sc) => ({
        id: sc?.page?.uid?.split('-')?.[1],
        completed: false,
      }));

      return {
        id: chapterId,
        subChapters
      };
    }));

    // createdAt and updatedAt are added when saving actual progress data
    const learningHubProgress = {
      user: user?.id,
      progressData,
    };
    await this.sharedMethods.saveDataToStorage(StorageKeys.learningHubProgress, learningHubProgress);
  }
}
