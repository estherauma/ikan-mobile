import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';
import { ImageselectComponent } from 'src/app/shared/components/imageselect/imageselect.component';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.page.html',
  styleUrls: ['./worker.page.scss'],
})
export class WorkerPage implements OnInit {
  commonText: any;
  docsCommonText: any;
  pageTitle: string = 'My Profile'
  imageUrl: string = '';
  activeSegment: string = 'info';

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public modalController: ModalController,
    public profileDataService: ProfilesDataService,
  ) { }

  async ngOnInit() {
    this.commonText = this.contentService?.commonText;
    const docsPageData = this.contentService.getContentByPropertyName('my-documents-common-text');
    this.docsCommonText = this.sharedMethods.convertAdditionalTextToObj(docsPageData?.additionalText);
    this.pageTitle = this.commonText?.myProfile || this.pageTitle;
    this.profileDataService.getAll().subscribe(async(data) => {
      const user = await this.sharedMethods.getUserData();
      const userProfile = data.find((profile) => profile.email === user?.email);
      if (userProfile?.profileImage) {
        this.imageUrl = userProfile?.profileImage;
      }
    });
  }

  onSegmentChange(e) {
    this.activeSegment = e?.detail?.value;
  }

  async changePhoto() {
    const modal = await this.modalController.create({
      component: ImageselectComponent,
      cssClass: 'notification-modal',
    });
    await modal.present();
    await modal.onDidDismiss().then(async(data) => {
      if (data?.data?.imageData && data?.data?.imageData.webPath) {
        this.imageUrl = data?.data?.imageData.webPath;
        const user = await this.sharedMethods.getUserData();
        this.profileDataService.updateProfilesField(user?.email, 'profile_image', this.imageUrl);
      } else if (data.role !== 'backdrop') {
        this.sharedMethods.showToast(this.docsCommonText?.profilePictureUpdateFailure);
      }
    });
  }
}
