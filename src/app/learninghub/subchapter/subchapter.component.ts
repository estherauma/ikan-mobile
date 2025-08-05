import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { GlobalErrorHandlerService } from 'src/app/shared/services/error-handler/global-error-handler.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { HubQuestionStatus, StorageKeys, UserData, UserRole } from 'src/app/shared/types/api-types';
import { SurveyDataService } from 'src/app/survey/data/survey-data.service';

@Component({
  selector: 'app-subchapter',
  templateUrl: './subchapter.component.html',
  styleUrls: ['./subchapter.component.scss'],
})
export class SubchapterComponent  implements OnInit {
  subChapterId: string;
  allPageData: any;
  pageContent: any = [];
  caseStudyInputs = {
    styles: 'case-study',
    icons: {
      forwardArrow: 'assets/icon/arrow-forward.svg',
      bookmarkFilled: '',
      bookmarkOutlined: '',
    }
  };
  imgUrl = ''; // TODO: use tuna icon as default
  upNextContent: any;
  nextChapterId: string;
  isCaseStudy = false;
  caseStudyUid: string;
  caseStudyImgUrl: string;
  networkStatus = false;
  savedInlineQuestions = [];
  user: UserData;
  isWorker = false;
  isVesselOwner = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public contentService: ContentService,
    public router: Router,
    public sharedmethods: SharedmethodsService,
    public analytics: AnalyticsService,
    public surveyDataService: SurveyDataService,
    public authService: AuthService,
    public globalErrorHandler: GlobalErrorHandlerService,
  ) {
    this.activatedRoute.params.subscribe(async params => {
      this.subChapterId = params?.subChapterId;
      this.caseStudyUid = params?.caseStudyUid;
      this.isCaseStudy = !!params?.caseStudyUid;
      this.caseStudyImgUrl = params?.imgUrl || '';
      await this.pageSetup();
    });
  }

  async ngOnInit() {
    this.networkStatus = await this.sharedmethods.checkInternetConnectionStatus();
    this.user = await this.sharedmethods.getUserData();
    this.isVesselOwner = this.authService.userRole === UserRole.vesselOwner;
    this.isWorker = this.authService.userRole === UserRole.worker;
    await this.pageSetup();
    this.setUpAnalytics();
    await this.markSubChapterAsCompleted();
  }

  async pageSetup() {
    await this.getContent();
    await this.getQuestionValues();
    await this.getQuestionStatus();
  }

  async getContent() {
    if (this.isCaseStudy) {
      this.allPageData = this.contentService.getContentByPropertyName(this.caseStudyUid);
      this.pageContent = this.allPageData?.pageContent;
      const chapterId = this.subChapterId?.split('.')[0];
      this.imgUrl = this.caseStudyImgUrl || this.sharedmethods?.getChapterBackground(chapterId, 'subchapter');
    } else {
      this.allPageData = this.contentService.getContentByPropertyName(this.subChapterId);
      await this.contentService.replaceVesselPlaceholderText();
      this.pageContent = this.allPageData?.pageContent;
      const chapterId = this.subChapterId?.split('.')[0];
      this.imgUrl = this.sharedmethods?.getChapterBackground(chapterId, 'subchapter');
      this.upNextContent = this.getNextChapterContent();
      this.savedInlineQuestions = this.surveyDataService.inlineQuestions;
    }
  }

  setUpAnalytics() {
    if (this.allPageData?.analyticsEventName) {
      this.analytics.trackEvent(this.allPageData.analyticsEventName, this.sharedmethods.analyticsEventParams);
    } else {
      if (this.isCaseStudy) {
        this.globalErrorHandler.handleError(
          null,
          `No analytics event name found for this case study: ${this.caseStudyUid} ${this.allPageData?.pageTitle}`
        );
      } else {
        this.globalErrorHandler.handleError(
          null,
          `No analytics event name found for this subchapter: ${this.subChapterId} ${this.allPageData?.pageTitle}`
        );
      }
    }
  }

  async markSubChapterAsCompleted() {
    const savedLearningHubProgress = await this.sharedmethods.readDataFromStorage(StorageKeys.learningHubProgress);
    const chapterId = this.subChapterId?.split('.')[0];
    const chapterData = savedLearningHubProgress?.progressData?.find(c => c.id === chapterId);
    const subChapterData = chapterData?.subChapters.find(sc => sc.id === this.subChapterId);

    if (subChapterData?.completed) { return; }

    subChapterData.completed = true;

    // Update learningHubProgress
    const now = this.sharedmethods.getCurrentDateTime();
    const learningHubProgress = {
      createdAt: now, // This will be overridden if alreadys exists
      createdBy: this.user?.id, // This will be overridden if alreadys exists
      ...savedLearningHubProgress,
      updatedAt: now,
      updatedBy: this.user?.id
    };
    await this.sharedmethods.saveDataToStorage(StorageKeys.learningHubProgress, learningHubProgress);
  }

  async getQuestionValues() {
    this.pageContent?.forEach(async(item) => {
      if (item?.type === 'questions') {
        const savedQtn = await this.savedInlineQuestions.find((el) => el.questionKey === item.key && el.createdBy === this.user?.id);
        if (savedQtn) {
          item.savedQtn = savedQtn;
          if (item?.questionType === 'multi-select') {
            const values: Array<string> = savedQtn.questionResponse?.split(',');
            const optValues = values.map((val) => val.trim());
            item.value = optValues;
          } else {
            item.value = savedQtn.questionResponse;
          }
        }
      }
    });
  }

  async getQuestionStatus() {
    this.pageContent?.forEach((item) => {
      if (item?.type === 'questions') {
        if (!item?.value) {
          item.status = HubQuestionStatus.pending;
          item.icon = 'help';
        } else if (
          (item.questionType === 'radio' || item.questionType === 'select')
          && item.value.toLowerCase() === 'yes'
        ) {
          item.status = HubQuestionStatus.answeredYes;
          item.icon = 'checkmark';
        } else if (
          (item.questionType === 'radio' || item.questionType === 'select')
          && item.value.toLowerCase() === 'no'
        ) {
          item.status = HubQuestionStatus.answeredNo;
          item.icon = 'close';
        } else if (
          (item.questionType === 'radio' || item.questionType === 'select')
          && (item.value.toLowerCase() !== 'yes' || item.value.toLowerCase() !== 'no')
        ) {
          item.status = HubQuestionStatus.answeredMaybe;
          item.icon = 'alert';
        } else {
          item.status = HubQuestionStatus.completed;
          item.icon = 'checkmark';
        }
      }
    });
  }

  goToNextChapter() {
    const chapterId = this.subChapterId.split('.')[0];
    this.router.navigate([ 'learninghub/chapters', this.nextChapterId, this.upNextContent?.page?.uid ]);
  }

  getNextChapterContent() {
    let nextSubChapterContent: any;
    // current chapter
    const chapterContent = this.contentService.getContentByPropertyName(this.subChapterId.split('.')[0]);
    const chapterList = (chapterContent?.pageContent?.find((e) => e.type === 'clickable_list'))?.list;
    chapterList.sort((a, b) => a.page.uid.split('.')[1] - b.page.uid.split('.')[1]);

    if (chapterList[chapterList.length - 1]?.page?.uid !== this.subChapterId) {
      const currentIndex = chapterList.findIndex((el) => el?.page?.uid === this.subChapterId);
      nextSubChapterContent = chapterList[currentIndex + 1];
      this.nextChapterId = this.subChapterId.split('.')[0];
    } else {
      // next chapter
      const nextChapterContent = this.contentService.getContentByPropertyName(`${Number(this.subChapterId.split('.')[0]) + 1}`);
      const clickableList = nextChapterContent?.pageContent?.find((e) => e.type === 'clickable_list') || [];
      const nextChapterList = clickableList?.list || [];
      nextChapterList.sort((a, b) => a.page.uid.split('.')[1] - b.page.uid.split('.')[1]);

      nextSubChapterContent = nextChapterList[0];
      this.nextChapterId = `${Number(this.subChapterId.split('.')[0]) + 1}`;
    }

    const url = this.sharedmethods?.getChapterBackground(this.nextChapterId, 'chapter');
    const data = {
      name: nextSubChapterContent?.label || '',
      description: nextSubChapterContent?.description || '',
      icon: nextSubChapterContent?.icon || url, // TODO: use tuna logo as default
      page: nextSubChapterContent?.page,
    };
    return nextSubChapterContent ? data : null;
  }

  handleCaseStudyClick(data) {
    const params = {
      subChapterId: data?.subChapter,
      caseStudyUid: data?.uid,
      isCaseStudy: true,
      imgUrl: data?.image?.url || '',
      ...data
    };
    this.router.navigate([ 'learninghub/case-studies', data?.uid, params ]);
  }

  viewQuestion(data) {
    data.subChapter = this.subChapterId;
    this.router.navigate([this.router.url, 'question', data?.key , { questionData: JSON.stringify(data) }]);
  }

  onPlay(e) {}
}
