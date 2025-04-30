import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ContentService } from '../shared/services/content/content.service';
import { register } from 'swiper/element/bundle';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AnalyticsService } from '../shared/services/analytics/analytics.service';
import { SharedmethodsService } from '../shared/services/sharedmethods/sharedmethods.service';
import { PageEventNames, AppEventNames } from '../shared/services/analytics/event-names';
import { Router } from '@angular/router';
import { StorageKeys } from '../shared/types/api-types';
import { SurveyDataService } from '../survey/data/survey-data.service';

register();
@Component({
  selector: 'app-consent-forms',
  templateUrl: './consent-forms.component.html',
  styleUrls: ['./consent-forms.component.scss'],
})
export class ConsentFormsComponent  implements OnInit {

  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;

  pages = [];
  showPrevBtn = false;
  audioUrl = '';
  consentFormGroup: FormGroup;
  formQuestions: any = [];
  commonText: any;

  constructor(
    public contentService: ContentService,
    public analyticsService: AnalyticsService,
    public sharedMethods: SharedmethodsService,
    public router: Router,
    public surveyDataService: SurveyDataService,
  ) { }

  async ngOnInit() {
    this.analyticsService.trackEvent(PageEventNames.viewConsentForm, this.sharedMethods.analyticsEventParams);
    this.commonText = this.contentService?.commonText;
    const pageOne = this.contentService.getContentByPropertyName('worker-consent-form-one');
    this.pages.push(pageOne);
    const pageTwo = this.contentService.getContentByPropertyName('worker-consent-form-two');
    this.pages.push(pageTwo);
    this.formQuestions = pageTwo?.pageContent?.filter((item) => item?.type === 'questions');
    this.setupForm();
  }

  /**
   * Since we are using innerHTML to render content
   * and angular routerLink doesn't work with innerHTML
   * we need to manually handle the click event on anchor tags
   * and navigate to the correct route within the app
   */
  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('/')) {
      event.preventDefault();
      const path = target.getAttribute('href');
      this.router.navigateByUrl(path);
    }
  }

  setupForm() {
    const group = {};
    this.formQuestions.forEach(entry => {
      const validators = [];
      if (entry.required) {
        validators.push(Validators.required);
      }
      group[entry.key] = new FormControl(null, validators);
    });
    this.consentFormGroup = new FormGroup(group);
  }

  goToNextSlide() {
    const swiper = this.swiperRef?.nativeElement.swiper;
    if (!swiper) { return; }
    swiper.slideNext();
    this.showPrevBtn = !!swiper.activeIndex;
  }

  goToPrevSlide() {
    const swiper = this.swiperRef?.nativeElement.swiper;
    if (!swiper) { return; }
    swiper.slidePrev();
    this.showPrevBtn = !!swiper.activeIndex;
  }

  // handleSelectChange(e) {}

  // handleRadioChange(event: any) {
  //   // page.selectedOption = event.detail.value;
  // }

  playAudio(url: string) {
    this.audioUrl = url;
    const audio: HTMLAudioElement = this.audioPlayerRef.nativeElement;
    audio.play();
  }

  async submitForm() {
    const key = 'i-have-read-and-understood-all-of-the-information-above-and-consent-to-have-my-de-identified-data-from-ikan-used-as-part-of-the-research-study';
    const date = this.sharedMethods.getCurrentDateTime('date');
    const user = await this.sharedMethods.readDataFromStorage(StorageKeys.userData);
    const consentQtn = this.formQuestions.find((qtn) => qtn.key === key);
    const untranslatedQtn = this.contentService.getUntranslatedInlineQuestion('worker-consent-form-two', key);
    const consentObj = {
      appRef: this.sharedMethods.generateAppRef(),
      surveyDate: date,
      questionKey: consentQtn.key,
      questionType: consentQtn.questionType,
      questionText: untranslatedQtn?.label || untranslatedQtn?.question,
      questionResponse: !!this.consentFormGroup.value?.[key],
      userId: user?.id,
    };

    const insertId = await this.surveyDataService.create(consentObj);
    if (!insertId) {
      this.sharedMethods.showToast(this.commonText?.errSavingResponses);
    } else {
      if (this.consentFormGroup.value?.[key]) {
        this.analyticsService.trackEvent(AppEventNames.acceptedConsentFormConditions, this.sharedMethods.analyticsEventParams);
      } else {
        this.analyticsService.trackEvent(AppEventNames.rejectedConsentFormConditions, this.sharedMethods.analyticsEventParams);
      }

      await this.sharedMethods.saveDataToStorage(StorageKeys.completedConsentForms, true);
      this.router.navigate(['dashboard/worker'], { replaceUrl: true });
    }
  }
}
