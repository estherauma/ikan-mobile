import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { UserData } from 'src/app/shared/types/api-types';
import { SurveyDataService } from 'src/app/survey/data/survey-data.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent  implements OnInit {

  pageData: any;
  commonText: any;
  quizData = [];
  user: UserData;

  constructor(
    public contentService: ContentService,
    public surveyDataService: SurveyDataService,
    public sharedmethods: SharedmethodsService,
  ) { }

  async ngOnInit() {
    await this.pageSetup();
  }

  async pageSetup() {
    this.user = await this.sharedmethods.getUserData();
    this.commonText = await this.contentService.commonText;
    // this.pageData =  await this.contentService.getContentByPropertyName('quiz');
    this.quizData = await this.getQuizContent();
  }

  async getQuizContent() {
    const chaptersData =  this.contentService.getContentByPropertyName('chapters-list');
    const chaptersClickableList = chaptersData?.pageContent?.find((e) => e.type === 'clickable_list');
    const chapters = chaptersClickableList?.list;
    const chaptersResult = await Promise.all(chapters?.map(async(chapter) => {
      const chapterId = chapter?.page?.uid;
      const chapterData = this.contentService.getContentByPropertyName(chapterId);
      const chapterClickableList = (chapterData?.pageContent?.find((e) => e.type === 'clickable_list'));
      const subChapters = chapterClickableList?.list;

      const subChaptersResult = [];
      await subChapters.forEach(async(item) => {
        const subChapter: any = {};

        const subChapterId = item?.page?.uid;
        const subChapterTitle = item?.label?.substring(item?.label?.indexOf(' ') + 1) || '';
        const subChapterData = this.contentService.getContentByPropertyName(subChapterId);
        const subChapterPageContent = subChapterData?.pageContent;
        const qtnsToDisplay = subChapterPageContent?.filter((x) => x?.type === 'questions' && x?.displayquestion);

        if (qtnsToDisplay?.length) {
          subChapter.title = subChapterTitle;
          subChapter.questions = qtnsToDisplay;
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

}
