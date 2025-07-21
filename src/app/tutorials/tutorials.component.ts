import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StorageKeys, UserData } from '../shared/types/api-types';
import { Router } from '@angular/router';
import { AnalyticsService } from '../shared/services/analytics/analytics.service';
import { AuthService } from '../shared/services/auth/auth.service';
import { ContentService } from '../shared/services/content/content.service';
import { SharedmethodsService } from '../shared/services/sharedmethods/sharedmethods.service';
import { ModalController } from '@ionic/angular';
import { TutorialDetailComponent } from './tutorial-detail/tutorial-detail.component';
import { AppEventNames, PageEventNames } from '../shared/services/analytics/event-names';

@Component({
  selector: 'app-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.scss'],
})
export class TutorialsComponent  implements OnInit {

  pageContent: any;
  commonText: any;
  user: UserData;
  audioUrl = '';

  @ViewChild('swiper', { static: false })
  swiperRef: ElementRef | undefined;

  @ViewChild('audioPlayer')
  audioPlayerRef!: ElementRef<HTMLAudioElement>;

  @ViewChild('videoPlayer')
  videoPlayerRef!: ElementRef<HTMLVideoElement>;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public router: Router,
    public analtyicsService: AnalyticsService,
    public authService: AuthService,
    public modalController: ModalController,
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
    const eventName = this.pageContent?.analyticsEventName || PageEventNames.viewAppTutotrials;
    await this.analtyicsService.trackEvent(eventName, eventParams);
  }

  async setup() {
    this.commonText = await this.contentService?.commonText;
    this.pageContent = await this.contentService?.getContentByPropertyName('app-tutorials');
    this.audioUrl = this.pageContent?.welcomeAudio?.url || '';
    this.user = await this.sharedMethods.getUserData();
    // filter out tutorials that are not applicable to the user role
    this.pageContent.tutorials.items = this.pageContent?.tutorials?.items.filter(item => (
      !item?.roles?.length ||
      item?.roles?.includes('all') ||
      item?.roles?.includes(this.user?.role)
    ));
  }

  onSlideChange(e) {
    // Stop audio or video if playing
    this.pauseAndResetAudio();
    this.stopAndResetVideo();

    // preload slide audio
    const activeIndex = e.detail[0].activeIndex;
    if (activeIndex === 0) {
      this.audioUrl = this.pageContent?.welcomeAudio?.url || '';
    } else if (activeIndex === 1) {
      this.audioUrl = this.pageContent?.tutorials?.introAudio?.url || '';
    }
  }

  async skipTutorials() {
    // Stop audio or video if playing
    this.pauseAndResetAudio();
    this.stopAndResetVideo();

    await this.sharedMethods.saveDataToStorage(StorageKeys.skippedAppTutorials, true);

    const eventParams = await this.sharedMethods.getAnalyticsEventParams();
    await this.analtyicsService.trackEvent(AppEventNames.skippedAppTutorials, eventParams);

    this.router.navigate([this.authService.getCurrentUserBaseUrlFromRole(this.user?.role)], { replaceUrl: true });
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

  async exitTutorials() {
    // Stop audio or video if playing
    this.pauseAndResetAudio();
    this.stopAndResetVideo();

    await this.sharedMethods.saveDataToStorage(StorageKeys.seenAppTutorials, true);

    const eventParams = this.sharedMethods.getAnalyticsEventParams();
    await this.analtyicsService.trackEvent(AppEventNames.seenAppTutorials, eventParams);

    this.router.navigate([this.authService.getCurrentUserBaseUrlFromRole(this.user?.role)], { replaceUrl: true });
  }

  async goToTutorialDetail(tutorial) {
    const modal = await this.modalController.create({
      component: TutorialDetailComponent,
      cssClass: 'tuna-modal tutorial-detail-modal',
      componentProps: {
        title: tutorial?.itemTitle || '',
        description: tutorial?.itemText,
        icon: tutorial?.itemIcon,
        videoUrl: tutorial?.itemVideo?.url,
        audioUrl: tutorial?.itemAudio?.url,
        analyticsEventName: tutorial?.itemAnalyticsEventName,
      },
      animated: true,
    });
    modal.present();
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

  stopAndResetVideo() {
    const video: HTMLVideoElement = this.videoPlayerRef.nativeElement;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }
}
