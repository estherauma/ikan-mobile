import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { TrainingVideoComponent } from '../training-video/training-video.component';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys, UserRole } from 'src/app/shared/types/api-types';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { pageEventNames } from 'src/app/shared/services/analytics/event-names';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  title = '';
  pageContent: any;
  learningHubChapters = [];

  constructor(
    public router: Router,
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public sharedMethods: SharedmethodsService,
    public analyticsService: AnalyticsService
  ) { }

  async ngOnInit() {
    this.pageContent =  this.contentService.getContentByPropertyName('chapters-list');
    this.title = this.pageContent?.pageTitle;
    const clickableList = this.pageContent?.pageContent?.find((e) => e.type === 'clickable_list');
    const chapters = clickableList?.list;
    this.learningHubChapters = chapters?.map((chapter) => ({
      title: chapter?.label,
      text : chapter?.description || '',
      progressBarValue : '0',
      progressBarType : 'primary',
      progressBarText: this.contentService?.commonText?.completionStatus,
       // TODO: use tuna icon as default
      imageUrl : chapter?.icon || 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
      page: chapter?.page
    }));

    const user = await this.sharedMethods.readDataFromStorage(StorageKeys.userData);
    const watchedTFAVideo = await this.sharedMethods.readDataFromStorage(StorageKeys.watchedTFAVideo);
    // show training video to workers only
    if (user?.role === UserRole.worker && !watchedTFAVideo) {
      await this.showTrainingVideo();
    }
    this.analyticsService.trackEvent(pageEventNames.learningHubHome, this.sharedMethods.analyticsEventParams)
  }

  onClick(item) {
    this.router.navigate(['learninghub/chapters', item?.page?.uid]);
  }

  async showTrainingVideo() {
    const modal = await this.modalCtrl.create({
      component: TrainingVideoComponent,
      cssClass: 'tfa-training-video',
      backdropDismiss: true,
    });
    modal.present();
    modal.onDidDismiss().then((data) => {});
  }

}
