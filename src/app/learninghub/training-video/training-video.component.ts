import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { AppEventNames, PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys } from 'src/app/shared/types/api-types';
import { SurveyDataService } from 'src/app/survey/data/survey-data.service';

@Component({
    selector: 'app-training-video',
    templateUrl: './training-video.component.html',
    styleUrls: ['./training-video.component.scss'],
    standalone: false
})
export class TrainingVideoComponent extends BaseformPage  implements OnInit {
  questionHelperText: any;
  video: any;
  networkStatus = false;
  defaultThumbnail = '/assets/icon/default-thumbnail.jpg';
  disclaimerText = '';

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public modalCtrl: ModalController,
    public apiService: ApiService,
    public surveysDataService: SurveyDataService,
    public analyticsService: AnalyticsService
  ) {
    super(contentService);
  }

  async ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.disclaimerText = this.commonText?.disclaimerMessage || '';
    this.networkStatus = await this.sharedMethods.checkInternetConnectionStatus();
    const pageData = this.contentService.getContentByPropertyName('tfa-training-video');
    this.pageTitle  = pageData?.pageTitle;
    this.video = pageData?.pageContent?.find((e) => e.type === 'video');
    this.video.mediaData.url = this.formatVideoUrl(this.video?.mediaData?.url);
    this.questionHelperText = pageData?.pageContent?.find((e) => e.type === 'text_area');

    this.formQuestions = this.getFormQuestions(pageData);
    this.formQuestions.forEach(entry => {
      const validators = this.sharedMethods.getFormValidators(entry);
      this.group[entry.key] = new FormControl(null, validators);
      entry.options[0] = { ...entry.options[0], value: 'True' };
      entry.options[1] = { ...entry.options[1], value: 'False' };
    });
    this.pageFormGroup = new FormGroup(this.group);
    this.analyticsService.trackEvent(PageEventNames.tfaVideo, this.sharedMethods.analyticsEventParams);
  }

  getFormQuestions(data) {
    return data?.pageContent?.filter((e) => e.type === 'questions');
  }

  formatVideoUrl(url: string) {
    return url?.replace('watch?v=', 'embed/');
  }

  onPlay(data) {}

  getVideoType(url: string) {
    return url?.endsWith('mp4') ? 'video/mp4' :
    url?.endsWith('webm') ? 'video/webm' :
    (url?.endsWith('ogv') || url?.endsWith('ogg')) ? 'video/ogg' :
    url?.endsWith('mov') ? 'video/quicktime':
    url?.endsWith('avi') ? 'video/x-msvideo':
    url?.endsWith('wmv') ? 'video/x-ms-wmv':
    url?.endsWith('flv') ? 'video/x-flv':
    url?.endsWith('mkv') ? 'video/x-matroska':
    url?.endsWith('3gp') ? 'video/3gpp':
    url?.endsWith('3g2') ? 'video/3gpp2':
    url?.endsWith('ts') ? 'video/MP2T':
    'video/mp4';
  }

  async onSubmit(formData) {
    this.sharedMethods.showLoader(this.commonText?.submittingYourData);
    const date = this.sharedMethods.getCurrentDateTime('date');
    const user = await this.sharedMethods.getUserData();
    const videoResponses = [];
    this.formQuestions.forEach((item) => {
      if (!item?.displayquestion) {return;}

      if (formData[item.key]) {
        const untranslatedQtn = this.contentService.getUntranslatedInlineQuestion('tfa-training-video', item?.key);

        let isFollowUpQuestionAnswered = false;
        let followUpQuestionResponse = formData[item?.followUpQuestion?.key] ?? null;
        if (item?.hasFollowUpQuestion && formData[item?.followUpQuestion?.key]) {
          isFollowUpQuestionAnswered = true;
          const unTranslatedFollowupQtn = untranslatedQtn?.options?.find(
            (opt) => opt?.followUpQuestion?.key === item?.followUpQuestion?.key)?.followUpQuestion;
          item.followUpQuestion.unTranslatedFollowupQtnText = unTranslatedFollowupQtn?.question;

          if (Array.isArray(followUpQuestionResponse)) {
            followUpQuestionResponse = followUpQuestionResponse.length ? followUpQuestionResponse.join(', ') : null;
          }
        }
        videoResponses.push({
          appRef: this.sharedMethods.generateAppRef(),
          userId: user?.id,
          surveyDate: date,
          questionKey: item.key,
          questionType: item.questionType,
          questionText: untranslatedQtn?.question,
          questionResponse: formData[item.key],
          followUpQuestionKey: isFollowUpQuestionAnswered ? item?.followUpQuestion?.key : null,
          followUpQuestionType: isFollowUpQuestionAnswered ? item?.followUpQuestion?.questionType : null,
          followUpQuestionText: isFollowUpQuestionAnswered ? item?.unTranslatedFollowupQtnText : null,
          followUpQuestionResponse: isFollowUpQuestionAnswered ? followUpQuestionResponse : null,
        });
      }
    });

    if (videoResponses?.length) {
      videoResponses.forEach(async(item) => {
        const insertId = await this.surveysDataService.create(item);
        if (!insertId) {
          this.sharedMethods.showToast(this.commonText?.errSavingResponses || 'Error saving responses');
        }
      });
    }

    await this.sharedMethods.saveDataToStorage(StorageKeys.watchedTFAVideo, true);
    this.analyticsService.trackEvent(AppEventNames.submitTrainingVideo, this.sharedMethods.analyticsEventParams);
    this.sharedMethods?.hideLoader();
    this.modalCtrl.dismiss();
  }

  onCancel() {
    this.analyticsService.trackEvent(AppEventNames.cancelTrainingVideo, this.sharedMethods.analyticsEventParams);
    this.modalCtrl?.dismiss();
  }
}
