import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { SurveyDataService } from 'src/app/survey/data/survey-data.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent  implements OnInit {
  questionData: any;
  commonText: any;
  isYesNoValue: boolean = false;
  hasFollowupQtn: boolean = false;
  followupQtnData: any;
  unTranslatedQtn: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public surveyDataService: SurveyDataService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      if (params?.questionData) {
        this.questionData = JSON.parse(params?.questionData);
      }
    });
    
    this.commonText = this.contentService?.commonText;
    this.unTranslatedQtn = this.contentService.getUntranslatedInlineQuestion(this.questionData?.subChapter, this.questionData?.key);
    if (this.questionData?.questionType === 'radio' || this.questionData?.questionType === 'select') {
      const values = this.questionData.options.map(obj => obj?.value?.toLowerCase());
      const containsYesNo = values.includes('yes') && values.includes('no');
      if (containsYesNo) {
        this.isYesNoValue = true;
        this.questionData.options.forEach((opt) => {
          if (opt?.value?.toLowerCase() === 'yes') {
            opt.icon = 'checkmark';
          } else if (opt.value?.toLowerCase() === 'no') {
            opt.icon = 'close';
          } else {
            opt.icon = 'alert';
          }
        });
      }
    }

    this.getFollowupQtn();
  }

  selectOption(value: string) {
    this.questionData.value = value;
    this.getFollowupQtn();
  }

  handleInputChange(e) {
    this.questionData.value = e.detail.value;
    this.getFollowupQtn();
  }
  
  handleSelectChange(e) {
    this.questionData.value = e.detail.value;
    this.getFollowupQtn();
  }

  getFollowupQtn() {
    // todo: clear followup value if value
    if (this.questionData?.options) {
      const selectedOption = this.questionData.options.find((opt) => opt.value === this.questionData.value);
      if (selectedOption?.followUpQuestion) {
        this.hasFollowupQtn = true;
        this.followupQtnData = selectedOption.followUpQuestion;
        if(this.followupQtnData?.key === 'See the Get Help section to find a workers union you can consult with') {
          this.followupQtnData.questionType = 'helperText';
        }
        if (this.questionData?.savedQtn?.followUpQuestionResponse) {
          if (this.followupQtnData.questionType === 'multi-select') {
            const values = this.questionData?.savedQtn?.followUpQuestionResponse.split(',');
            const optValues = values.map((val) => val.trim());
            this.followupQtnData.value = optValues;
          } else {
            this.followupQtnData.value = this.questionData?.savedQtn?.followUpQuestionResponse;
          }
        }
      } else {
        this.hasFollowupQtn = false;
        this.followupQtnData = null;
      }
    }
  }

  handleFollowUpInputChange(e) {
    this.followupQtnData.value = e.detail.value;
  }
  
  handleFollowUpSelectChange(e) {
    this.followupQtnData.value = e.detail.value;
  }

  // Question responses are saved even if followup question is not answered
  // Uncomment code below to only submit if followup question is also answered
  async submitAnswer() {
    if (!this.questionData?.value) return;
    
    // Uncomment code below to only submit if followup question is answered
    // if (this.hasFollowupQtn && !this.followupQtnData?.value && this.followupQtnData?.questionType !== 'helperText') {
    //   // TODO: translate
    //   this.sharedMethods.showToast(this.commonText?.pleaseAnswerFollowupQtn);
    //   return;
    // }

    if (this.questionData && this.questionData?.value && Array.isArray(this.questionData?.value)) {
      this.questionData.value = this.questionData.value.length ? this.questionData.value.join(', ') : null;
    }
    if (this.followupQtnData) {
      const unTranslatedFollowupQtnText = this.unTranslatedQtn?.options?.find(
        (opt) => opt?.followUpQuestion?.key === this.followupQtnData?.key)?.followUpQuestion;
      this.followupQtnData.unTranslatedQuestionText = unTranslatedFollowupQtnText?.question;
    }
    if (this.followupQtnData && this.followupQtnData?.value && Array.isArray(this.followupQtnData?.value)) {
      this.followupQtnData.value = this.followupQtnData.value.length ? this.followupQtnData.value.join(', ') : null;
    }

    if (!this.questionData?.savedQtn) {
      const user = await this.sharedMethods.getUserData();
      const dataToSave = {
        appRef: this.sharedMethods.generateAppRef(),
        userId: user.id,
        subChapter: this.questionData?.subChapter,
        questionKey: this.questionData?.key,
        questionType: this.questionData?.questionType,
        questionText: this.unTranslatedQtn?.question || this.questionData?.question,
        questionResponse: this.questionData?.value,
        followUpQuestionKey: this.followupQtnData ? this.followupQtnData?.key : null,
        followUpQuestionType: this.followupQtnData ? this.followupQtnData?.questionType : null,
        followUpQuestionText: this.followupQtnData ? (this.followupQtnData?.unTranslatedQuestionText || this.followupQtnData?.question) : null,
        followUpQuestionResponse: this.followupQtnData ? this.followupQtnData?.value : null,
      };

      const insertId = await this.surveyDataService.createInlineQuestion(dataToSave);
      if (insertId) {
        const chapterId = this.questionData.subChapter.split('.')[0];
        const subChapterId = this.questionData.subChapter;
        this.router.navigate([ 'learninghub/chapters', chapterId, subChapterId ], { replaceUrl: true });
      } else {
        this.sharedMethods.showToast(this.commonText?.errSavingResponses);
      }
    } else {
      const savedQtn = this.questionData?.savedQtn;
      if (
        savedQtn?.questionResponse === this.questionData?.value &&
        savedQtn?.questionType === this.questionData?.questionType &&
        savedQtn?.questionText === this.unTranslatedQtn?.question &&
        savedQtn?.followUpQuestionResponse === this.followupQtnData?.value &&
        savedQtn?.followUpQuestionKey === this.followupQtnData?.key &&
        savedQtn?.followUpQuestionType === this.followupQtnData?.questionType &&
        savedQtn?.followUpQuestionText === this.followupQtnData?.unTranslatedQuestionText
      ) {
        const chapterId = this.questionData.subChapter.split('.')[0];
        const subChapterId = this.questionData.subChapter;
        this.router.navigate([ 'learninghub/chapters', chapterId, subChapterId ], { replaceUrl: true });
        return;
      }
      
      const dataToUpdate = {
        id: this.questionData?.savedQtn.id,
        questionResponse: this.questionData?.value,
        questionType: this.questionData?.questionType,
        questionText: this.unTranslatedQtn?.question || this.questionData?.question,
        followUpQuestionKey: this.followupQtnData ? this.followupQtnData?.key : null,
        followUpQuestionType: this.followupQtnData ? this.followupQtnData?.questionType : null,
        followUpQuestionText: this.followupQtnData ? (this.followupQtnData?.unTranslatedQuestionText || this.followupQtnData?.question) : null,
        followUpQuestionResponse: this.followupQtnData ? this.followupQtnData?.value : null,
      };

      const updateId = await this.surveyDataService.updateInlineQuestion(dataToUpdate);
      if (updateId) {
        const chapterId = this.questionData.subChapter.split('.')[0];
        const subChapterId = this.questionData.subChapter;
        this.router.navigate([ 'learninghub/chapters', chapterId, subChapterId ], { replaceUrl: true });
      } else {
        this.sharedMethods.showToast(this.commonText?.errSavingResponses);
      }
    }
  }
}
