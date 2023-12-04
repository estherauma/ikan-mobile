import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ContentService } from '../shared/services/content/content.service';
import { BaseformPage } from '../shared/components/baseform/baseform.page';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { SharedmethodsService } from '../shared/services/sharedmethods/sharedmethods.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StorageKeys, SurveyModes, SurveyResponse } from '../shared/types/api-types';
import { AuthService } from '../shared/services/auth/auth.service';
import { ApiService } from '../shared/services/api/api.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent extends BaseformPage  implements OnInit {
  attemptedFollowUpQtnKeys = {};
  mode = '';

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public router: Router,
    public authService: AuthService,
    public cdr: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute,
    public apiService: ApiService,
  ) {
    super(contentService)
    this.getMode();
  }

  async ngOnInit() {
    this.commonText = this.contentService?.commonText;
    const pageData = this.contentService.getContentByPropertyName('survey');
    this.pageTitle  = pageData?.pageTitle;

    if (this.mode === SurveyModes.notification) {
      this.formQuestions = await this.contentService.getSurveyQuestions();
    } else {
      this.formQuestions = pageData?.formQuestions;
    }

    this.formQuestions.forEach(entry => {
      this.group[entry.key] = new FormControl('', []);

      if (entry?.options) {
        this.group[entry.key].valueChanges.subscribe((value) => {
          // Remove previous option from formGroup
          if (this.attemptedFollowUpQtnKeys?.[entry.key]) {
            this.pageFormGroup.removeControl(this.attemptedFollowUpQtnKeys[entry.key]);
            delete this.attemptedFollowUpQtnKeys[entry.key];

          }

          const currentOption = entry.options.filter(x => x.value === value);
          if (currentOption?.[0]?.followUpQuestion) {
            entry.hasFollowUpQuestion = true;
            entry.followUpQuestion = currentOption?.[0]?.followUpQuestion;
            this.group[entry.followUpQuestion.key] = new FormControl('', []);
            this.attemptedFollowUpQtnKeys[entry.key] = currentOption?.[0]?.followUpQuestion.key;
          } else {
            entry.hasFollowUpQuestion = false;
            entry.followUpQuestion = null;
          }
          this.cdr.detectChanges();
        });
      }
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  getMode() {
    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      if (queryParams && Object.keys(queryParams).length > 0) {
        this.mode = queryParams?.mode || '';
      }
    });
  }

  async onSubmit(formData) {
    this.sharedMethods.showLoader(this.commonText?.submittingYourData);
    const date = this.sharedMethods.getCurrentDateTime('date');
    const user = await this.sharedMethods.readDataFromStorage(StorageKeys.userData);
    const surveyData = [];
    this.formQuestions.forEach((qtn) => {
      // check if question has response and if response is an array, check it has at least one item
      if (formData[qtn.key] && (!Array.isArray(formData[qtn.key]) || formData[qtn.key].length)) {;
        surveyData.push({
          app_ref: this.sharedMethods.generateAppRef(),
          survey_date: date,
          question_key: qtn.key,
          question_text: qtn?.label,
          question_response: formData[qtn.key],
        });

        // check if question has followup question and if followup question has response and if response is an array, check it has at least one item
        if (qtn?.hasFollowUpQuestion && formData[qtn?.followUpQuestion?.key]
              && (!Array.isArray(formData[qtn?.followUpQuestion?.key]) || formData[qtn?.followUpQuestion?.key].length)) {
          surveyData.push({
            app_ref: this.sharedMethods.generateAppRef(),
            survey_date: date,
            question_key: qtn?.followUpQuestion?.key,
            question_text: qtn?.followUpQuestion?.label,
            question_response: formData[qtn?.followUpQuestion?.key],
          });
        };
      }
    });

    if (surveyData?.length) {
      if (await this.sharedMethods.checkInternetConnectionStatus()) {

        await Promise.all(surveyData?.map(async (item) => {
          try {
            await this.apiService.post('surveys', item).toPromise();
            surveyData.shift();
          } catch (e) {
            console.error(e);
          }
        }));
      }

      await this.sharedMethods.saveSurveyDataToLocalStorage(StorageKeys.survey, surveyData);
    }

    if (this.mode === SurveyModes.notification) {
      await this.removeCategoryFromSavedOptions();
    }

    this.sharedMethods?.hideLoader();
    this.router.navigate([this.authService.getCurrentUserBaseUrlFromRole(user?.role)]);
  }

  async removeCategoryFromSavedOptions() {
    const allCategories = await this.sharedMethods.readDataFromStorage(StorageKeys.surveyCategories);
    allCategories.shift();
    await this.sharedMethods.saveDataToStorage(StorageKeys.surveyCategories, allCategories);
  }
}
