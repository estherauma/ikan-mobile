import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ContentService } from '../shared/services/content/content.service';
import { register } from 'swiper/element/bundle';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AnalyticsService } from '../shared/services/analytics/analytics.service';
import { SharedmethodsService } from '../shared/services/sharedmethods/sharedmethods.service';
import { pageEventNames, appEventNames } from '../shared/services/analytics/event-names';
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
  audioUrl: string = '';
  consentFormGroup: FormGroup;
  formQuestions: any = [];
  commonText: any;

  constructor(
    public contentService: ContentService,
    public analyticsService: AnalyticsService,
    public sharedMethods: SharedmethodsService,
    // private el: ElementRef,
    // private renderer: Renderer2,
    public router: Router,
    public surveyDataService: SurveyDataService,
  ) { }

  async ngOnInit() {
    this.analyticsService.trackEvent(pageEventNames.viewConsentForm, this.sharedMethods.analyticsEventParams);
    this.commonText = this.contentService?.commonText;
    const pageOne = this.contentService.getContentByPropertyName('worker-consent-form-one');
    // this.linkPrivacyPolicy(pageOne);
    this.pages.push(pageOne);
    const pageTwo = this.contentService.getContentByPropertyName('worker-consent-form-two');
    this.pages.push(pageTwo);
    this.formQuestions = pageTwo?.pageContent?.filter((item) => item?.type === 'questions');
    this.setupForm();
  }

  // ngAfterViewInit() {
  //   const hostElement = this.el.nativeElement.querySelector('.textarea');
  //   hostElement.querySelectorAll('a[href^="/about/privacy-policy"]').forEach((link: HTMLAnchorElement) => {
  //     this.renderer.listen(link, 'click', (event) => {
  //       event.preventDefault();
  //       console.log('link----', link);
  //       this.router.navigateByUrl(link.getAttribute('href'));
  //     });
  //   });
  // }

  // linkPrivacyPolicy(pageOne) {
  //   pageOne?.pageContent?.forEach((item) => {
  //     item?.description?.forEach((desc) => {
  //       if (desc?.paragraph) {
  //         // desc.paragraph = desc.paragraph.replace('href=\"/about/privacy-policy\"', 'routerLink=\"/about/privacy-policy\"');
  //       }
  //     });
  //   });
  // }

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

  async submitForm(){
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
        this.analyticsService.trackEvent(appEventNames.acceptedConsentFormConditions, this.sharedMethods.analyticsEventParams);
      } else {
        this.analyticsService.trackEvent(appEventNames.rejectedConsentFormConditions, this.sharedMethods.analyticsEventParams);
      }

      await this.sharedMethods.saveDataToStorage(StorageKeys.completedConsentForms, true);
      this.router.navigate(['dashboard/worker'], { replaceUrl: true });
    }
  }
}
