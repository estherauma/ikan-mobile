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
})
export class PageprofilecontainerComponent implements OnInit {
  commonText: any;
  reSendInviteBtnTitle = 'Re-send invite';

  @Input() imageUrl = '';
  @Input() navItems = [];
  @Input() active = this.navItems.length && this.navItems[0];
  @Input() status = 'Pending'; // TODO: add translation
  @Input() title = '';
  @Input() isResendInviteBtn = false;
  @Input() withinNav = true;
  @Input() worker;

  @Output() clickedMenuItem = new EventEmitter<any>();

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public modalController: ModalController,
    public profilesDataService: ProfilesDataService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.reSendInviteBtnTitle = this.commonText?.resendInvite;
  }

  onClickedMenu(data) {
    this.clickedMenuItem.emit(data);
  }

  async changePhoto(worker) {
    const modal = await this.modalController.create({
      component: ImageselectComponent,
      cssClass: 'notification-modal',
    });
    await modal.present();
    await modal.onDidDismiss().then(async(data) => {
      if (data?.data?.imageData && data?.data?.imageData.webPath) {
        this.imageUrl = data?.data?.imageData.webPath;
        this.profilesDataService.updateProfilesField(worker?.email, 'profile_image', this.imageUrl);
      } else if (data?.role !== 'backdrop') {
        // translate
        this.sharedMethods.showToast('Failed to updated profile picture.')
      }
    });
  }

}
