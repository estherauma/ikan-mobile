import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
    selector: 'app-create',
    templateUrl: './create.page.html',
    styleUrls: ['./create.page.scss'],
    standalone: false
})
export class CreatePage extends BaseformPage implements OnInit {

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public modalCtrl: ModalController,
    public router: Router,
    public analytics: AnalyticsService
  ) {
    super(contentService);
    const pageData = this.contentService.getContentByPropertyName('createworkerprofile');
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      const validators = this.sharedMethods.getFormValidators(entry);
      this.group[entry.key] = new FormControl('', validators);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {
    this.submitButtonText = this.contentService.commonText?.create;
    this.analytics.trackEvent(PageEventNames.createWorker, this.sharedMethods.analyticsEventParams)
  }

  async onSubmit(formData) {
    this.modalCtrl.dismiss();
    const data = JSON.stringify(formData);
    const questions = JSON.stringify(this.formQuestions);
    this.router.navigate(['workers/createdetail', {data, questions}]);
  }

}
