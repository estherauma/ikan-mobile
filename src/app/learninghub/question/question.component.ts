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
    if (this.followupQtnData && this.followupQtnData?.value && Array.isArray(this.followupQtnData?.value)) {
      this.followupQtnData.value = this.followupQtnData.value.length ? this.followupQtnData.value.join(', ') : null;
    }
    const user = await this.sharedMethods.getUserData();
    const dataToSave = {
      appRef: this.sharedMethods.generateAppRef(),
      userId: user.id,
      subChapter: this.questionData?.subChapter,
      questionKey: this.questionData?.key,
      questionType: this.questionData?.questionType,
      questionText: this.questionData?.question,
      questionResponse: this.questionData?.value,
      followUpQuestionKey: this.followupQtnData ? this.followupQtnData?.key : null,
      followUpQuestionType: this.followupQtnData ? this.followupQtnData?.questionType : null,
      followUpQuestionText: this.followupQtnData ? this.followupQtnData?.question : null,
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
  }
}
