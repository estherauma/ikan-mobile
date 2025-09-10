import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
    selector: 'app-tutorial-detail',
    templateUrl: './tutorial-detail.component.html',
    styleUrls: ['./tutorial-detail.component.scss'],
    standalone: false
})
export class TutorialDetailComponent  implements OnInit {

  title = '';
  description: any;
  icon = '';
  videoUrl = '';
  audioUrl = '';
  analyticsEventName = '';
  isVideoPlaying = false;

  @ViewChild('audioPlayer')
  audioPlayerRef!: ElementRef<HTMLAudioElement>;
  
  @ViewChild('videoPlayer')
  videoPlayerRef!: ElementRef<HTMLVideoElement>;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public analyticsService: AnalyticsService,
  ) { }

  async ngOnInit() {
    await this.pageSetup();

    if (this.analyticsEventName) {
      const eventParams = this.sharedMethods.getAnalyticsEventParams();
      await this.analyticsService.trackEvent(this.analyticsEventName, eventParams);
    }
  }

  async pageSetup() {
    this.title = this.navParams.get('title') || '';
    this.description = this.navParams.get('description') || '';
    this.icon = this.navParams.get('icon') || '';
    this.videoUrl = this.navParams.get('videoUrl') || '';
    this.audioUrl = this.navParams.get('audioUrl') || '';
    this.analyticsEventName = this.navParams.get('analyticsEventName') || '';
  }

  closeModal() {
    // Stop audio or video if playing
    this.pauseAndResetAudio();
    this.stopAndResetVideo();
    this.modalCtrl.dismiss();
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

  playAudio() {
    const audio: HTMLAudioElement = this.audioPlayerRef.nativeElement;
    audio.play();
  }

  playVideo() {
    this.isVideoPlaying = true;
    const video: HTMLVideoElement = this.videoPlayerRef.nativeElement;
    if (video) {
      video.play();
    }
  }

  stopAndResetVideo() {
    this.isVideoPlaying = false;
    const video: HTMLVideoElement = this.videoPlayerRef.nativeElement;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }
}
