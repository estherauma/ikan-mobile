import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ContentService } from '../shared/services/content/content.service';
import { BaseformPage } from '../shared/components/baseform/baseform.page';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedmethodsService } from '../shared/services/sharedmethods/sharedmethods.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StorageKeys, SurveySources } from '../shared/types/api-types';
import { AuthService } from '../shared/services/auth/auth.service';
import { ApiService } from '../shared/services/api/api.service';
import { SurveyDataService } from './data/survey-data.service';
import { SyncService } from '../shared/services/sync/sync.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent extends BaseformPage  implements OnInit, OnDestroy {
  attemptedFollowUpQtnKeys = {};
  surveySource = '';
  surveyTopic: string = '';
  disclaimerText: string = '';
  pageName: string = 'survey';

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public router: Router,
    public authService: AuthService,
    public cdr: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute,
    public apiService: ApiService,
    public surveysDataService: SurveyDataService,
    public syncService: SyncService,
  ) {
    super(contentService)
  }

  async ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.disclaimerText = `${this.commonText?.disclaimerMessage || ''} ${this.commonText?.disclaimerContactMessage || ''}`;
    await this.contentService.replaceVesselPlaceholderText();
    const pageData = this.contentService.getContentByPropertyName('survey');
    this.pageTitle  = pageData?.pageTitle;
    await this.getSurveySource();

    // Temporary. TO BE REMOVED
    const currentDate = new Date();
    const expiryDate = new Date('2025-02-24');
    if (currentDate < expiryDate) {
      this.surveyTopic = '3.5'; // wages
    }

    if (this.surveySource === SurveySources.notification) {
      this.formQuestions = await this.contentService.getSurveyQuestions(this.surveyTopic);
      this.pageName = this.contentService.currentSurveyCategory;
    } else {
      this.formQuestions = pageData?.formQuestions;
    }

    this.formQuestions.forEach(entry => {
      if (!entry?.displayquestion) return;
      const validators = this.sharedMethods.getFormValidators(entry);
      this.group[entry.key] = new FormControl('', validators);
    });
    this.pageFormGroup = new FormGroup(this.group);

    this.formQuestions.forEach((entry) => {
      if (!entry?.displayquestion) return;
      
      if (entry?.options) {
        this.pageFormGroup.controls?.[entry.key]?.valueChanges.subscribe((value) => {
          // Remove previous option from formGroup
          if (this.attemptedFollowUpQtnKeys?.[entry.key]) {
            this.pageFormGroup.removeControl(this.attemptedFollowUpQtnKeys[entry.key]);
            delete this.attemptedFollowUpQtnKeys[entry.key];
          }

          const currentOption = entry.options.filter(x => x.value === value);
          if (currentOption?.[0]?.followUpQuestion) {
            entry.hasFollowUpQuestion = true;
            entry.followUpQuestion = currentOption?.[0]?.followUpQuestion;
            const followupValidators = this.sharedMethods.getFormValidators(entry.followUpQuestion);
            
            if (entry.followUpQuestion?.key === 'See the Get Help section to find a workers union you can consult with') {
              entry.followUpQuestion.questionType = 'p';
            } else {
              this.pageFormGroup.addControl(entry.followUpQuestion.key, new FormControl('', followupValidators));
              this.attemptedFollowUpQtnKeys[entry.key] = currentOption?.[0]?.followUpQuestion.key;
            }
          } else {
            entry.hasFollowUpQuestion = false;
            entry.followUpQuestion = null;
          }
          this.cdr.detectChanges();
        });
      }
    });
  }

  async ngOnDestroy() {
    if (this.surveySource === SurveySources.notification) {
      await this.removeCategoryFromSavedOptions();
    }
  }

  async getSurveySource() {
    return this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      if (queryParams && Object.keys(queryParams).length > 0) {
        this.surveySource = queryParams?.surveySource || '';
        this.surveyTopic = queryParams?.surveyTopic || '';
      }
    });
  }

  async onSubmit(formData) {
    this.sharedMethods.showLoader(this.commonText?.submittingYourData);
    const date = this.sharedMethods.getCurrentDateTime('date');
    const user = await this.sharedMethods.readDataFromStorage(StorageKeys.userData);
    const surveyData = [];
    this.formQuestions.forEach((qtn) => {
      if (!qtn?.displayquestion) return;

      // check if question has response and if response is an array, check it has at least one item
      if (formData[qtn.key] && (!Array.isArray(formData[qtn.key]) || formData[qtn.key].length)) {
        let untranslatedQtn;
        if (this.pageName === 'survey') {
          untranslatedQtn = this.contentService.getUntranlatedSurveyQuestion(this.pageName, qtn?.key);
        } else {
          untranslatedQtn = this.contentService.getUntranslatedInlineQuestion(this.pageName, qtn?.key);
        }
        
        let isFollowUpQuestionAnswered = false;
        let followUpQuestionResponse = formData[qtn?.followUpQuestion?.key] ?? null;
        // check if question has followup question and if followup question has response and if response is an array, check it has at least one item
        if (qtn?.hasFollowUpQuestion && formData[qtn?.followUpQuestion?.key]) {
          isFollowUpQuestionAnswered = true;
          const unTranslatedFollowupQtn = untranslatedQtn?.options?.find(
            (opt) => opt?.followUpQuestion?.key === qtn?.followUpQuestion?.key)?.followUpQuestion;
          qtn.followUpQuestion.unTranslatedFollowupQtnText = unTranslatedFollowupQtn?.label || unTranslatedFollowupQtn?.question;
          
          if (Array.isArray(followUpQuestionResponse)) {
            followUpQuestionResponse = followUpQuestionResponse.length ? followUpQuestionResponse.join(', ') : null;
          }
        }
        
        surveyData.push({
          appRef: this.sharedMethods.generateAppRef(),
          surveyDate: date,
          questionKey: qtn.key,
          questionType: qtn.questionType,
          questionText: untranslatedQtn?.label || untranslatedQtn?.question,
          questionResponse: formData[qtn.key],
          userId: user?.id,
          followUpQuestionKey: isFollowUpQuestionAnswered ? qtn?.followUpQuestion?.key : null,
          followUpQuestionType: isFollowUpQuestionAnswered ? qtn?.followUpQuestion?.questionType : null,
          followUpQuestionText: isFollowUpQuestionAnswered ? qtn?.followUpQuestion?.unTranslatedFollowupQtnText : null,
          followUpQuestionResponse: isFollowUpQuestionAnswered ? followUpQuestionResponse : null,
        });
      }
    });

    if (surveyData?.length) {
      surveyData.forEach(async (item) => {
        const insertId =  await this.surveysDataService.create(item);
        if (!insertId) {
          this.sharedMethods.showToast(this.commonText?.errSavingResponses || 'Error saving responses');
        }
      });
      await this.surveysDataService.retriveSurveys();
      await this.syncService.syncSurveyResponses();
    }

    // Temporarily disabled so that category is removed from saved options
    // even if user does not complete survey.
    // Added to ngDestroy
    // if (this.surveySource === SurveySources.notification) {
    //   await this.removeCategoryFromSavedOptions();
    // }

    this.sharedMethods?.hideLoader();
    this.router.navigate([this.authService.getCurrentUserBaseUrlFromRole(user?.role)]);
  }

  async removeCategoryFromSavedOptions() {
    const allCategories = await this.sharedMethods.readDataFromStorage(StorageKeys.surveyCategories);
    allCategories.shift();
    await this.sharedMethods.saveDataToStorage(StorageKeys.surveyCategories, allCategories);
  }

}
