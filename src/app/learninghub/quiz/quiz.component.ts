import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { UserData } from 'src/app/shared/types/api-types';
import { SurveyDataService } from 'src/app/survey/data/survey-data.service';
import { QuestionComponent } from '../question/question.component';

@Component({
    selector: 'app-quiz',
    templateUrl: './quiz.component.html',
    styleUrls: ['./quiz.component.scss'],
    standalone: false
})
export class QuizComponent  implements OnInit {

  pageData: any;
  commonText: any;
  quizData = [];
  user: UserData;
  userRole: any;

  constructor(
    public contentService: ContentService,
    public surveyDataService: SurveyDataService,
    public sharedmethods: SharedmethodsService,
    public modalCtrl: ModalController,
  ) { }

  async ngOnInit() {
    await this.pageSetup();
  }

  async pageSetup() {
    this.user = await this.sharedmethods.getUserData();
    this.userRole = this.user?.role;
    this.commonText = await this.contentService.commonText;
    // this.pageData =  await this.contentService.getContentByPropertyName('quiz');
    this.quizData = await this.getQuizContent();
  }

  async getQuizContent() {
    await this.contentService.replaceVesselPlaceholderText();
    const chaptersData =  this.contentService.getContentByPropertyName('learning-hub-chapters-list');
    const chaptersClickableList = chaptersData?.pageContent?.find((e) => e.type === 'clickable_list');
    const chapters = chaptersClickableList?.list;
    const chaptersResult = await Promise.all(chapters?.map(async(chapter) => {
      const chapterId = chapter?.page?.uid?.split('-')?.[1];
      const chapterData = this.contentService.getContentByPropertyName(chapterId);
      const chapterClickableList = (chapterData?.pageContent?.find((e) => e.type === 'clickable_list'));
      const subChapters = chapterClickableList?.list;

      const subChaptersResult = [];
      await subChapters.forEach(async(item) => {
        const subChapter: any = {};

        const subChapterId = item?.page?.uid?.split('-')?.[1];
        const subChapterTitle = item?.label?.substring(item?.label?.indexOf(' ') + 1) || '';
        const subChapterData = this.contentService.getContentByPropertyName(subChapterId);
        const subChapterPageContent = subChapterData?.pageContent;
        const qtnsToDisplay = subChapterPageContent?.filter((x) => x?.type === 'questions' && x?.displayquestion && (!this.userRole || !x?.roles || x?.roles?.includes(this.userRole)));

        if (qtnsToDisplay?.length) {
          // get question values
          const qtnsToDisplayWithValues = await this.getQuestionValues(qtnsToDisplay);
          // Add subchapter to each qtn. It's used when submitting data
          const quizSubChapterQtns = qtnsToDisplayWithValues.map((x) => ({...x, subChapter: subChapterId}));

          subChapter.title = item?.label;  // subChapterTitle;
          subChapter.questions = quizSubChapterQtns;
          subChaptersResult.push(subChapter);
        }
      });

      return {
        title: chapterData?.pageTitle || chapter?.label || '',
        subChapters: subChaptersResult
      };
    }));

    return chaptersResult;
  }

  async getQuestionValues(qtns) {
    const result = [];
    const savedInlineQuestions: any[] = this.surveyDataService.inlineQuestions;

    await qtns?.forEach(async(qtn) => {
      const resQtn: any = { ...qtn };
      const savedQtn = await savedInlineQuestions.find((el) => el.questionKey === qtn.key && el.createdBy === this.user?.id);
      if (savedQtn) {
        resQtn.savedQtn = savedQtn;
        if (qtn?.questionType === 'multi-select') {
          const values: Array<string> = savedQtn.questionResponse?.split(',');
          const optValues = values.map((val) => val.trim());
          resQtn.value = optValues;
        } else {
          resQtn.value = savedQtn.questionResponse;
        }
      }
      result.push(resQtn);
    });

    return result;
  }

  async openQuestion(questionData) {
    const modal = await this.modalCtrl.create({
      cssClass: 'tuna-modal quiz-qtn-modal',
      component: QuestionComponent,
      componentProps: {
        questionData,
        userRole: this.userRole,
      }
    });
    await modal.present();
    modal.onDidDismiss().then(async() => {
      await this.pageSetup();
    });
  }
}
