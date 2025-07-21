import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserData } from '../shared/types/api-types';
import { Router } from '@angular/router';
import { AnalyticsService } from '../shared/services/analytics/analytics.service';
import { AuthService } from '../shared/services/auth/auth.service';
import { ContentService } from '../shared/services/content/content.service';
import { SharedmethodsService } from '../shared/services/sharedmethods/sharedmethods.service';
import { PageEventNames } from '../shared/services/analytics/event-names';

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

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public router: Router,
    public analtyicsService: AnalyticsService,
    public authService: AuthService,
  ) {}

  async ngOnInit() {
    await this.setup();
    this.audioUrl = this.pageContent?.welcomeAudio?.url || '';

    const eventParams = this.sharedMethods.getAnalyticsEventParams();
    const eventName = this.pageContent?.analyticsEventName || PageEventNames.viewAppTutotrials;
    // await this.analtyicsService.trackEvent(eventName, eventParams);
  }

  async setup() {
    this.commonText = await this.contentService?.commonText;
    console.log('commonText-----', this.commonText);
    this.pageContent = await this.contentService?.getContentByPropertyName('app-tutorials');
    console.log('pageContent-----', this.pageContent);
  }

  onSlideChange(e) {
    // Stop audio if playing
    this.pauseAndResetAudio();

    // preload slide audio
    const activeIndex = e.detail[0].activeIndex;
    if (activeIndex === 0) {
      this.audioUrl = this.pageContent?.welcomeAudio?.url || '';
    } else if (activeIndex === 1) {
      this.audioUrl = this.pageContent?.tutorials?.introAudio?.url || '';
    }
  }

  skipTutorials() {}

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

  exitTutorials() {}

  goToTutorialDetail(tutorial) {}

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
