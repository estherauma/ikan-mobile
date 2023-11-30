import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-training-video',
  templateUrl: './training-video.component.html',
  styleUrls: ['./training-video.component.scss'],
})
export class TrainingVideoComponent extends BaseformPage  implements OnInit {
  questionHelperText: any;
  video: any;
  networkStatus = false;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
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
      this.group[entry.key] = new FormControl('', [ Validators.required ]);
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

  onSubmit(formData) {
    console.log('onSubmit......', formData);
  }
}
