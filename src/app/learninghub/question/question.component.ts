import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { SyncService } from 'src/app/shared/services/sync/sync.service';
import { SurveyDataService } from 'src/app/survey/data/survey-data.service';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.scss'],
    standalone: false
})
export class QuestionComponent  implements OnInit {
  questionData: any;
  commonText: any;
  isYesNoValue = false;
  hasFollowupQtn = false;
  followupQtnData: any;
  unTranslatedQtn: any;
  hasSecondFollowupQtn = false;
  secondFollowupQtnData: any;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public surveyDataService: SurveyDataService,
    public router: Router,
    public syncService: SyncService,
    public navParams: NavParams,
    public modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    if (this.navParams) {
      this.questionData = this.navParams.get('questionData');
    }

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
    
    // Intialize question response if user has already answered before
     if (this.questionData?.savedQtn?.questionResponse) {
      if (this.questionData?.questionType === 'multi-select') {
        const values = this.questionData?.savedQtn?.questionResponse.split(',');
        const optValues = values.map((val) => val.trim());
        this.questionData.value = optValues;
      } else {
        this.questionData.value = this.questionData?.savedQtn?.questionResponse;
        this.questionData.otherInput = this.questionData?.savedQtn?.otherInput;
      }
    }

    this.getFollowupQtn();
    this.getSecondFollowupQtn();
  }

  selectOption(value: string) {
    this.questionData.value = value;
    this.getFollowupQtn();
    this.getSecondFollowupQtn();
  }

  handleInputChange(e) {
    this.questionData.value = e.detail.value;
    this.getFollowupQtn();
    this.getSecondFollowupQtn();
  }

  handleSelectChange(e) {
    this.questionData.value = e.detail.value;
    this.getFollowupQtn();
    this.getSecondFollowupQtn();
  }

  handleOtherInputChange(e) {
    this.questionData.otherInput = e.detail.value;
    this.getFollowupQtn();
    this.getSecondFollowupQtn();
  }

  getFollowupQtn() {
    if (!this.questionData?.options) {
      this.hasFollowupQtn = false;
      this.followupQtnData = null;
      return;
    }
    
    const selectedOption = this.questionData?.options?.find((opt) => opt.value === this.questionData.value);
    if (selectedOption?.followUpQuestion) {
      this.hasFollowupQtn = true;
      this.followupQtnData = selectedOption.followUpQuestion;
      if (this.followupQtnData?.key === 'See the Get Help section to find a workers union you can consult with') {
        this.followupQtnData.questionType = 'helperText';
      }
      // Intialize followup question response if user has already answered before
      if (this.questionData?.savedQtn?.followUpQuestionResponse) {
        if (this.followupQtnData.questionType === 'multi-select') {
          const values = this.questionData?.savedQtn?.followUpQuestionResponse.split(',');
          const optValues = values.map((val) => val.trim());
          this.followupQtnData.value = optValues;
        } else {
          this.followupQtnData.value = this.questionData?.savedQtn?.followUpQuestionResponse;
          this.followupQtnData.followupQuestionOtherInput = this.questionData?.savedQtn?.followUpQuestionOtherInput;
        }
      }
    } else {
      this.hasFollowupQtn = false;
      this.followupQtnData = null;
    }
    
    this.getSecondFollowupQtn();
  }

  handleFollowUpInputChange(e) {
    this.followupQtnData.value = e.detail.value;
    this.getSecondFollowupQtn();
  }

  handleFollowUpSelectChange(e) {
    this.followupQtnData.value = e.detail.value;
    this.getSecondFollowupQtn();
  }

  handleFollowUpQtnOtherInputChange(e) {
    this.followupQtnData.followupQuestionOtherInput = e.detail.value;
    this.getSecondFollowupQtn();
  }

  async getSecondFollowupQtn() {
    if (!this.followupQtnData?.options) {
      this.hasSecondFollowupQtn = false;
      this.secondFollowupQtnData = null;
      return;
    }
    
    const selectedOption = await this.followupQtnData?.options?.find((opt) => opt.value === this.followupQtnData.value);
    if (selectedOption?.secondFollowUpQuestion) {
      this.hasSecondFollowupQtn = true;
      this.secondFollowupQtnData = selectedOption.secondFollowUpQuestion;
      // Intialize second followup question response if user has already answered before
      if (this.questionData?.savedQtn?.secondFollowUpQuestionResponse) {
        if (this.secondFollowupQtnData.questionType === 'multi-select') {
          const values = this.questionData?.savedQtn?.secondFollowUpQuestionResponse.split(',');
          const optValues = values.map((val) => val.trim());
          this.secondFollowupQtnData.value = optValues;
        } else {
          this.secondFollowupQtnData.value = this.questionData?.savedQtn?.secondFollowUpQuestionResponse;
          this.secondFollowupQtnData.secondFollowupQuestionOtherInput = this.questionData?.savedQtn?.secondFollowUpQuestionOtherInput;
        }
      }
    } else {
      this.hasSecondFollowupQtn = false;
      this.secondFollowupQtnData = null;
    }
  }

  handleSecondFollowUpInputChange(e) {
    this.secondFollowupQtnData.value = e.detail.value;
  }

  handleSecondFollowUpSelectChange(e) {
    this.secondFollowupQtnData.value = e.detail.value;
  }

  handleSecondFollowUpQtnOtherInputChange(e) {
    this.secondFollowupQtnData.secondFollowupQuestionOtherInput = e.detail.value;
  }

  // Question responses are saved even if followup question is not answered
  // Uncomment code below to only submit if followup question is also answered
  async submitAnswer() {
    if (!this.questionData?.value) {
      await this.modalCtrl?.dismiss();
      return;
    }

    // Uncomment code below to only submit if followup question is answered
    // if (this.hasFollowupQtn && !this.followupQtnData?.value && this.followupQtnData?.questionType !== 'helperText') {
    //   this.sharedMethods.showToast(this.commonText?.pleaseAnswerFollowupQtn);
    //   return;
    // }

    // QUESTION
    if (this.questionData && this.questionData?.value && Array.isArray(this.questionData?.value)) {
      this.questionData.value = this.questionData.value.length ? this.questionData.value.join(', ') : null;
    }
    // FOLLOWUP QUESTION
    if (this.followupQtnData) {
      const unTranslatedFollowupQtnText = this.unTranslatedQtn?.options?.find(
        (opt) => opt?.followUpQuestion?.key === this.followupQtnData?.key)?.followUpQuestion;
      this.followupQtnData.unTranslatedQuestionText = unTranslatedFollowupQtnText?.question;
    }
    if (this.followupQtnData && this.followupQtnData?.value && Array.isArray(this.followupQtnData?.value)) {
      this.followupQtnData.value = this.followupQtnData.value.length ? this.followupQtnData.value.join(', ') : null;
    }
    // SECOND FOLLOWUP QUESTION
    if (this.secondFollowupQtnData) {
      const unTranslatedSecondFollowupQtnText = this.followupQtnData?.options?.find(
        (opt) => opt?.secondFollowUpQuestion?.key === this.secondFollowupQtnData?.key)?.secondFollowUpQuestion;
      this.secondFollowupQtnData.unTranslatedQuestionText = unTranslatedSecondFollowupQtnText?.question;
    }
    if (this.secondFollowupQtnData && this.secondFollowupQtnData?.value && Array.isArray(this.secondFollowupQtnData?.value)) {
      this.secondFollowupQtnData.value = this.secondFollowupQtnData.value.length ? this.secondFollowupQtnData.value.join(', ') : null;
    }

    if (!this.questionData?.savedQtn) {
      const user = await this.sharedMethods.getUserData();
      const dataToSave = {
        appRef: this.sharedMethods.generateAppRef(),
        userId: user?.id,
        subChapter: this.questionData?.subChapter?.split('-')?.[1] || this.questionData?.subChapter,
        questionKey: this.questionData?.key,
        questionType: this.questionData?.questionType,
        questionText: this.unTranslatedQtn?.question || this.questionData?.question,
        questionResponse: this.questionData?.value,
        otherInput: this.questionData?.otherInput,
        followUpQuestionKey: this.followupQtnData ? this.followupQtnData?.key : null,
        followUpQuestionType: this.followupQtnData ? this.followupQtnData?.questionType : null,
        followUpQuestionText: this.followupQtnData ?
          (this.followupQtnData?.unTranslatedQuestionText || this.followupQtnData?.question) : null,
        followUpQuestionResponse: this.followupQtnData ? this.followupQtnData?.value : null,
        followUpQuestionOtherInput: this.followupQtnData ? this.followupQtnData?.followupQuestionOtherInput : null,
        secondFollowUpQuestionKey: this.secondFollowupQtnData ? this.secondFollowupQtnData?.key : null,
        secondFollowUpQuestionType: this.secondFollowupQtnData ? this.secondFollowupQtnData?.questionType : null,
        secondFollowUpQuestionText: this.secondFollowupQtnData ?
          (this.secondFollowupQtnData?.unTranslatedQuestionText || this.secondFollowupQtnData?.question) : null,
        secondFollowUpQuestionResponse: this.secondFollowupQtnData ? this.secondFollowupQtnData?.value : null,
        secondFollowUpQuestionOtherInput: this.secondFollowupQtnData ? this.secondFollowupQtnData?.secondFollowupQuestionOtherInput : null,
      };

      const insertId = await this.surveyDataService.createInlineQuestion(dataToSave);
      if (insertId) {
        await this.syncService.syncInlineQuestions();
        await this.modalCtrl?.dismiss();
      } else {
        this.sharedMethods.showToast(this.commonText?.errSavingResponses);
      }
    } else {
      const savedQtn = this.questionData?.savedQtn;
      if (
        savedQtn?.questionResponse === this.questionData?.value &&
        savedQtn?.questionType === this.questionData?.questionType &&
        savedQtn?.questionText === this.unTranslatedQtn?.question &&
        savedQtn?.otherInput === this.questionData?.otherInput &&
        savedQtn?.followUpQuestionResponse === this.followupQtnData?.value &&
        savedQtn?.followUpQuestionKey === this.followupQtnData?.key &&
        savedQtn?.followUpQuestionType === this.followupQtnData?.questionType &&
        savedQtn?.followUpQuestionText === this.followupQtnData?.unTranslatedQuestionText &&
        savedQtn?.followUpQuestionOtherInput === this.followupQtnData?.followupQuestionOtherInput &&
        savedQtn?.secondFollowUpQuestionResponse === this.secondFollowupQtnData?.value &&
        savedQtn?.secondFollowUpQuestionKey === this.secondFollowupQtnData?.key &&
        savedQtn?.secondFollowUpQuestionType === this.secondFollowupQtnData?.questionType &&
        savedQtn?.secondFollowUpQuestionText === this.secondFollowupQtnData?.unTranslatedQuestionText &&
        savedQtn?.secondFollowUpQuestionOtherInput === this.secondFollowupQtnData?.secondFollowupQuestionOtherInput
      ) {
        await this.modalCtrl?.dismiss();
        return;
      }

      const dataToUpdate = {
        id: this.questionData?.savedQtn.id,
        questionResponse: this.questionData?.value,
        questionType: this.questionData?.questionType,
        questionText: this.unTranslatedQtn?.question || this.questionData?.question,
        otherInput: this.questionData?.otherInput,
        followUpQuestionKey: this.followupQtnData ? this.followupQtnData?.key : null,
        followUpQuestionType: this.followupQtnData ? this.followupQtnData?.questionType : null,
        followUpQuestionText: this.followupQtnData ?
          (this.followupQtnData?.unTranslatedQuestionText || this.followupQtnData?.question) : null,
        followUpQuestionResponse: this.followupQtnData ? this.followupQtnData?.value : null,
        followUpQuestionOtherInput: this.followupQtnData ? this.followupQtnData?.followupQuestionOtherInput : null,
        secondFollowUpQuestionKey: this.secondFollowupQtnData ? this.secondFollowupQtnData?.key : null,
        secondFollowUpQuestionType: this.secondFollowupQtnData ? this.secondFollowupQtnData?.questionType : null,
        secondFollowUpQuestionText: this.secondFollowupQtnData ?
          (this.secondFollowupQtnData?.unTranslatedQuestionText || this.secondFollowupQtnData?.question) : null,
        secondFollowUpQuestionResponse: this.secondFollowupQtnData ? this.secondFollowupQtnData?.value : null,
        secondFollowUpQuestionOtherInput: this.secondFollowupQtnData ? this.secondFollowupQtnData?.secondFollowupQuestionOtherInput : null,
      };

      const updateId = await this.surveyDataService.updateInlineQuestion(dataToUpdate);
      if (updateId) {
        await this.syncService.syncInlineQuestions();
        await this.modalCtrl?.dismiss();
      } else {
        this.sharedMethods.showToast(this.commonText?.errSavingResponses);
      }
    }
  }
}
