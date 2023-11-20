import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ContentService } from '../shared/services/content/content.service';
import { BaseformPage } from '../shared/components/baseform/baseform.page';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { SharedmethodsService } from '../shared/services/sharedmethods/sharedmethods.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StorageKeys, SurveyModes } from '../shared/types/api-types';
import { AuthService } from '../shared/services/auth/auth.service';

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
    const now = this.sharedMethods.getCurrentDateTime();
    const user = await this.sharedMethods.readDataFromStorage(StorageKeys.userData);
    const surveyData = {
      ...formData,
      createdAt: now
    };
    await this.sharedMethods.saveSurveyDataToLocalStorage(StorageKeys.survey, date, surveyData);
    await this.removeCategoryFromSavedOptions();

    this.sharedMethods?.hideLoader();
    this.router.navigate([this.authService.getCurrentUserBaseUrlFromRole(user?.role)]);
  }

  async removeCategoryFromSavedOptions() {
    const allCategories = await this.sharedMethods.readDataFromStorage(StorageKeys.surveyCategories);
    allCategories.shift();
    await this.sharedMethods.saveDataToStorage(StorageKeys.surveyCategories, allCategories);
  }
}
