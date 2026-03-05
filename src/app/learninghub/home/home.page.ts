import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { TrainingVideoComponent } from '../training-video/training-video.component';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys, UserRole } from 'src/app/shared/types/api-types';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: false
})
export class HomePage implements OnInit {
  title = '';
  pageData: any;
  learningHubChapters = [];
  savedLearningHubProgress: any;

  constructor(
    public router: Router,
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public sharedMethods: SharedmethodsService,
    public analyticsService: AnalyticsService
  ) {
    this.activatedRoute.params.subscribe(async(params) => {
      await this.pageSetup();
    });
  }

  async ngOnInit() {
    await this.pageSetup();

    const user = await this.sharedMethods.readDataFromStorage(StorageKeys.userData);
    const watchedTFAVideo = await this.sharedMethods.readDataFromStorage(StorageKeys.watchedTFAVideo);
    // show training video to workers only
    if (user?.role === UserRole.worker && !watchedTFAVideo) {
      await this.showTrainingVideo();
    }
    this.analyticsService.trackEvent(PageEventNames.learningHubHome, this.sharedMethods.analyticsEventParams);
  }

  async pageSetup() {
    this.pageData =  this.contentService.getContentByPropertyName('learning-hub-chapters-list');
    this.title = this.pageData?.pageTitle;
    const clickableList = this.pageData?.pageContent?.find((e) => e.type === 'clickable_list');
    const chapters = clickableList?.list;
    this.savedLearningHubProgress = await this.sharedMethods.readDataFromStorage(StorageKeys.learningHubProgress);
    this.learningHubChapters = await Promise.all(chapters?.map(async(chapter) => {
      const chapterId = chapter?.page?.uid?.split('-')?.[1];
      const chapterContent = this.contentService.getContentByPropertyName(`chapter-${chapterId}`);
      const subChapterList = chapterContent?.pageContent?.[0]?.list;
      return {
        chapterId,
        title: chapter?.label,
        description : chapter?.description || '',
        progress: await this.getChapterProgress(chapterId, subChapterList) || 0,
        // TODO: use tuna icon as default
        imageUrl : chapter?.icon || 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
        page: chapter?.page
      };
    }));
  }

  async getChapterProgress(chapterId: any, subChapterList) {
    if (!this.savedLearningHubProgress) { return 0; }

    const chapterData = this.savedLearningHubProgress?.progressData?.find(c => c.id === chapterId);
    const completed = chapterData?.subChapters.filter(sc => sc.completed).length;

    if (!completed) { return 0; }
    return Math.round((completed / subChapterList?.length) * 100);
  }

  onClick(item) {
    const chapterId = item?.page?.uid?.split('-')?.[1];
    this.router.navigate(['learninghub/chapters', chapterId]);
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
