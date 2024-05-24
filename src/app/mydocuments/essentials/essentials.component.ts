import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreatepassportPage } from '../createpassport/createpassport.page';
import { DocumentsDataService } from '../data/documents-data.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { UploadService } from 'src/app/shared/services/upload/upload.service';

@Component({
  selector: 'app-essentials',
  templateUrl: './essentials.component.html',
  styleUrls: ['./essentials.component.scss'],
})
export class EssentialsComponent  implements OnInit {

  commonText: any;
  userData: any;
  userPassportDetails: any;
  passportImageUrl: string = '';

  constructor(
    public router: Router,
    public modalController: ModalController,
    public documentsDataService: DocumentsDataService,
    public sharedMethods: SharedmethodsService,
    public contentService: ContentService,
    public uploadService: UploadService,
  ) { }

  async ngOnInit() {
    this.commonText = this.contentService.commonText;
    this.userData = await this.sharedMethods.getUserData();
    this.userPassportDetails = await this.documentsDataService.getUserPassport(this.userData.id);
    if (this.userPassportDetails && this.userPassportDetails.imageUrl) {
      this.passportImageUrl = this.userPassportDetails.imageUrl;
    }
  }

  async addPassport() {
    const modal = await this.modalController.create({
      cssClass: 'notification-modal',
      component: CreatepassportPage,
    });
    modal.present();
    modal.onDidDismiss().then((data) => {
      this.ngOnInit();
    });
  }

  addVisa() {}

  addSeamansBook() {}

  addDocument() {}
}
