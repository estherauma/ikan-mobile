import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ContentService } from '../shared/services/content/content.service';
import { SharedmethodsService } from '../shared/services/sharedmethods/sharedmethods.service';
import { Router } from '@angular/router';
import { AnalyticsService } from '../shared/services/analytics/analytics.service';
import { StorageKeys, UserData } from '../shared/types/api-types';
import { AppEventNames, PageEventNames } from '../shared/services/analytics/event-names';
import { AuthService } from '../shared/services/auth/auth.service';

@Component({
    selector: 'app-welcome-screens',
    templateUrl: './welcome-screens.component.html',
    styleUrls: ['./welcome-screens.component.scss'],
    standalone: false
})
export class WelcomeScreensComponent  implements OnInit {

  pageTitle: string;
  pageContent: any;
  showWelcomeScreens: false;
  slides = [];
  commonText: any;
  user: UserData;
  audioUrl = '';

  @ViewChild('swiper', { static: false })
  swiperRef: ElementRef | undefined;

  @ViewChild('audioPlayer')
  audioPlayerRef!: ElementRef<HTMLAudioElement>;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public router: Router,
    public analtyicsService: AnalyticsService,
    public authService: AuthService,
  ) {
    this.contentService.watchContent().subscribe(async(resp) => {
      if (resp) {
        await this.setup();
      }
    });
  }

  async ngOnInit() {
    await this.setup();

    const eventParams = this.sharedMethods.getAnalyticsEventParams();
    await this.analtyicsService.trackEvent(PageEventNames.viewWelcomeScreens, eventParams);
  }

  async setup() {
    this.commonText = await this.contentService?.commonText;
    this.pageContent = await this.contentService?.getContentByPropertyName('welcome-screens');
    this.pageTitle = this.pageContent?.pageTitle;
    this.showWelcomeScreens = this.pageContent?.showSlides;
    this.slides = this.pageContent?.slides;
    this.audioUrl = this.slides?.[0]?.slideAudio?.url || '';
    this.user = await this.sharedMethods.getUserData();
  }

  onSlideChange(e) {
    // Stop audio if playing
    this.pauseAndResetAudio();

    // preload slide audio
    const activeIndex = e.detail[0].activeIndex;
    this.audioUrl = this.slides?.[activeIndex]?.slideAudio?.url || '';
  }

  goToPreviousSlide() {
    const swiper = this.swiperRef?.nativeElement?.swiper;
    if (!swiper) { return; }
    swiper.slidePrev();
  }

  goToNextSlide() {
    const swiper = this.swiperRef?.nativeElement.swiper;
    if (!swiper) { return; }
    swiper.slideNext();
  }

  async exitWelcomeScreens() {
    // Stop audio if playing
    this.pauseAndResetAudio();

    await this.sharedMethods.saveDataToStorage(StorageKeys.seenWelcomeScreens, true);

    const eventParams = this.sharedMethods.getAnalyticsEventParams();
    await this.analtyicsService.trackEvent(AppEventNames.seenWelcomeScreens, eventParams);

    this.router.navigate([this.authService.getCurrentUserBaseUrlFromRole(this.user?.role)], { replaceUrl: true });
  }

  async skipWelcomeScreens(idx, slide) {
    // Stop audio if playing
    this.pauseAndResetAudio();

    await this.sharedMethods.saveDataToStorage(StorageKeys.skippedWelcomeScreens, true);

    const eventParams = await this.sharedMethods.getAnalyticsEventParams();
    const eventData = {
      lastWatchedSlide: slide?.slideKey || 'Not specified',
      percentageWatched: `${(idx + 1)/this.slides.length * 100}%`
    };
    eventParams.data = eventData;
    await this.analtyicsService.trackEvent(AppEventNames.skippedWelcomeScreens, eventParams);

    this.router.navigate([this.authService.getCurrentUserBaseUrlFromRole(this.user?.role)], { replaceUrl: true });
  }

  playAudio(url: string) {
    this.audioUrl = url;
    const audio: HTMLAudioElement = this.audioPlayerRef.nativeElement;
    audio.play();
  }

  pauseAudio() {
    const audio: HTMLAudioElement = this.audioPlayerRef.nativeElement;
    if (audio) {
      audio.pause();
    }
  }

  pauseAndResetAudio() {
    const audio: HTMLAudioElement = this.audioPlayerRef.nativeElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }
}
