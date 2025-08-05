import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { GlobalErrorHandlerService } from 'src/app/shared/services/error-handler/global-error-handler.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys, UserData, UserRole } from 'src/app/shared/types/api-types';
import { SurveyDataService } from 'src/app/survey/data/survey-data.service';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss'],
})
export class ChapterComponent  implements OnInit {

  pageData: any;
  learningHubSubChapters = [];
  chapterId: string;
  bgImgUrl = '';
  commonText: any;
  user: UserData;
  isWorker = false;
  isVesselOwner = false;
  savedLearningHubProgress: any;

  constructor(
    public router: Router,
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
    public sharedmethods: SharedmethodsService,
    public analytics: AnalyticsService,
    public globalErrorHandler: GlobalErrorHandlerService,
    public surveyDataService: SurveyDataService,
  ) {
    this.activatedRoute.params.subscribe(async params => {
      this.chapterId = params?.chapterId;
      await this.pageSetup();
    });
  }

  async ngOnInit() {
    if (this.pageData.analyticsEventName) {
      this.analytics.trackEvent(this.pageData.analyticsEventName, this.sharedmethods.analyticsEventParams);
    } else {
      this.globalErrorHandler.handleError(
        null,
        `No analytics event name found for this chapter: ${this.chapterId} ${this.pageData?.pageTitle}`
      );
    }
  }

  async pageSetup() {
    this.user = await this.sharedmethods.getUserData();
    this.isVesselOwner = this.user?.role === UserRole.vesselOwner;
    this.isWorker = this.user?.role === UserRole.worker;
    this.commonText = await this.contentService.commonText;
    this.pageData =  await this.contentService.getContentByPropertyName(this.chapterId);
    const clickableList = (this.pageData?.pageContent?.find((e) => e.type === 'clickable_list'));
    const subChapters = clickableList?.list;
    this.bgImgUrl = this.sharedmethods.getChapterBackground(this.chapterId);
    this.savedLearningHubProgress = await this.sharedmethods.readDataFromStorage(StorageKeys.learningHubProgress);
    this.learningHubSubChapters = await Promise.all(subChapters?.map(async(subChapter) => {
      const subChapterId = subChapter?.page?.uid;
      const subChapterTitle = subChapter?.label?.substring(subChapter?.label?.indexOf(' ') + 1) || '';
      const quizDetails = await this.getQuizDetails(subChapterId);
      return {
        name: subChapterTitle,
        description: subChapter?.description || '',
        icon: subChapter?.icon || this.bgImgUrl, // TODO: use tuna icon as default
        page: subChapter?.page,
        displayQuiz: quizDetails?.displayQuiz,
        quizCompleted: quizDetails?.quizCompleted,
        isCompleted: await this.isSubChapterCompleted(subChapterId),
      };
    }));
  }

  async isSubChapterCompleted(subChapterId) {
    const chapterData = this.savedLearningHubProgress?.progressData?.find(c => c.id === this.chapterId);
    const subChapterData = chapterData?.subChapters.find(sc => sc.id === subChapterId);
    return !!subChapterData?.completed;
  }

  viewDetails(item) {
    this.router.navigate([ 'learninghub/chapters', this.chapterId, item?.page?.uid ]);
  }

  /**
   * Take quiz option is only displayed for the worker role
   */
  async getQuizDetails(subChapterId) {
    const details = {
      displayQuiz: false,
      quizCompleted: false,
    };
    if (this.isWorker) {
      const subChapterPageData = this.contentService.getContentByPropertyName(subChapterId);
      const subChapterPageContent = subChapterPageData?.pageContent;
      const qtnsToDisplay = subChapterPageContent?.filter((item) => item?.type === 'questions' && item?.displayquestion);

      if (qtnsToDisplay?.length) {
        // get question values
        await this.getQuestionValues(subChapterPageContent);

        details.displayQuiz = true;

        const qtnsCompleted = qtnsToDisplay.filter((item) => item?.value);
        details.quizCompleted = qtnsToDisplay.length === qtnsCompleted.length;
      }
    }
    return details;
  }

  async getQuestionValues(pageContent) {
    const savedInlineQuestions = this.surveyDataService.inlineQuestions;
    if (savedInlineQuestions?.length) {
      pageContent?.forEach(async(item) => {
        if (item?.type === 'questions') {
          const savedQtn = await savedInlineQuestions.find((el) => el.questionKey === item.key && el.createdBy === this.user?.id);
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
  }

  goToQuiz(e: MouseEvent) {
    e.stopPropagation();
    this.router.navigate([ 'learninghub/quiz' ]);
  }
}
