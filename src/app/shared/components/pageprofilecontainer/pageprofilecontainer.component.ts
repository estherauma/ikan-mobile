import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { SharedmethodsService } from '../../services/sharedmethods/sharedmethods.service';
import { ImageselectComponent } from '../imageselect/imageselect.component';
import { ModalController } from '@ionic/angular';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';


@Component({
    selector: 'app-pageprofilecontainer',
    templateUrl: './pageprofilecontainer.component.html',
    styleUrls: ['./pageprofilecontainer.component.scss'],
    standalone: false
})
export class PageprofilecontainerComponent implements OnInit {
  commonText: any;
  docsCommonText: any;
  reSendInviteBtnTitle = 'Re-send invite';

  @Input() imageUrl = '';
  @Input() navItems = [];
  @Input() active = this.navItems.length && this.navItems[0];
  @Input() status = 'Pending'; // TODO: add translation
  @Input() title = '';
  @Input() isResendInviteBtn = false;
  @Input() withinNav = true;
  @Input() worker: any;

  @Output() clickedMenuItem = new EventEmitter<any>();

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public modalController: ModalController,
    public profilesDataService: ProfilesDataService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    const docsPageData = this.contentService.getContentByPropertyName('my-documents-common-text');
    this.docsCommonText = this.sharedMethods.convertAdditionalTextToObj(docsPageData?.additionalText);
    this.reSendInviteBtnTitle = this.commonText?.resendInvite;
  }

  onClickedMenu(data: any) {
    this.clickedMenuItem.emit(data);
  }

  async changePhoto(worker: any) {
    const modal = await this.modalController.create({
      component: ImageselectComponent,
      cssClass: 'notification-modal',
    });
    await modal.present();
    await modal.onDidDismiss().then(async(data) => {
      if (data?.data?.imageData && data?.data?.imageData.webPath) {
        this.imageUrl = data?.data?.imageData.webPath;
        const result = await this.profilesDataService.updateProfilesField(worker?.email, worker?.mobile, 'profile_image', this.imageUrl);
        if (!result) {
          console.error(`Failed to update profile image for ${worker?.email || worker?.mobile}`);
          this.sharedMethods.showToast(this.docsCommonText?.profilePictureUpdateFailure);
        }
      } else if (data?.role !== 'backdrop') {
        this.sharedMethods.showToast(this.docsCommonText?.profilePictureUpdateFailure);
      }
    });
  }

}
