import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-tutorial-detail',
  templateUrl: './tutorial-detail.component.html',
  styleUrls: ['./tutorial-detail.component.scss'],
})
export class TutorialDetailComponent  implements OnInit {

  title = '';
  description: any;
  icon = '';
  videoUrl = '';
  audioUrl = '';
  analyticsEventName = '';

  @ViewChild('audioPlayer')
  audioPlayerRef!: ElementRef<HTMLAudioElement>;

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
    this.modalCtrl.dismiss();
  }

  playAudio() {
    const audio: HTMLAudioElement = this.audioPlayerRef.nativeElement;
    audio.play();
  }
}
