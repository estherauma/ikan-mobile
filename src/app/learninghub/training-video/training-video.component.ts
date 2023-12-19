import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys } from 'src/app/shared/types/api-types';
import { SurveyDataService } from 'src/app/survey/data/survey-data.service';

@Component({
  selector: 'app-training-video',
  templateUrl: './training-video.component.html',
  styleUrls: ['./training-video.component.scss'],
})
export class TrainingVideoComponent extends BaseformPage  implements OnInit {
  questionHelperText: any;
  video: any;
  networkStatus = false;
  defaultThumbnail = '/assets/icon/default-thumbnail.jpg';

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public modalCtrl: ModalController,
    public apiService: ApiService,
    public surveysDataService: SurveyDataService,
  ) {
    super(contentService)
  }

  async ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.networkStatus = await this.sharedMethods.checkInternetConnectionStatus();
    const pageData = this.contentService.getContentByPropertyName('tfa-training-video');
    this.pageTitle  = pageData?.pageTitle;
    this.video = pageData?.pageContent?.find((e) => e.type === 'video');
    this.video.mediaData.url = this.formatVideoUrl(this.video?.mediaData?.url);
    this.questionHelperText = pageData?.pageContent?.find((e) => e.type === 'text_area');

    this.formQuestions = this.getFormQuestions(pageData);
    this.formQuestions.forEach(entry => {
      this.group[entry.key] = new FormControl(null, [ Validators.required ]);
      entry.options[0] = { ...entry.options[0], value: 'True' };
      entry.options[1] = { ...entry.options[1], value: 'False' };
    });
    this.pageFormGroup = new FormGroup(this.group);
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
    const videoResponses =  this.formQuestions.map((item) => {
      return {
        app_ref: this.sharedMethods.generateAppRef(),
        survey_date: date,
        question_key: item.key,
        question_text: item?.label || item?.question,
        question_response: formData[item.key],
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

    this.sharedMethods?.hideLoader();
    this.modalCtrl.dismiss();
  }
}
