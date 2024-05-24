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
  userVisaDetails: any;
  visaImageUrl: string = '';
  userSeamansBookDetails: any;
  seamansBookImageUrl: string = '';
  essentialDocuments: any = [];

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

    this.essentialDocuments = this.getEssentialDocuments();
    this.userVisaDetails = this.essentialDocuments.find((doc) => doc.fileName === 'ikan-my-visa');
    this.visaImageUrl = this.userVisaDetails?.fileUrl || '';
    this.userSeamansBookDetails = this.essentialDocuments.find((doc) => doc.fileName === 'ikan-my-seamans-book');
    this.seamansBookImageUrl = this.userSeamansBookDetails?.fileUrl || '';
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

  async addVisa() {
    const image = await this.uploadService.takePicture();
    const now = this.sharedMethods.getCurrentDateTime();
    const visaSaveObj = {
      appRef: this.sharedMethods.generateAppRef(),
      userId: this.userData.id,
      fileName: 'ikan-my-visa',
      fileUrl: image.webPath,
      fileSize:  '',
      docType: image.docType,
      isEssential: true,
      createdAt: now,
      updatedAt: now,
      createdBy: this.userData.id,
      updatedBy: this.userData.id,
    };
    const docInsertId = await this.documentsDataService.create(visaSaveObj);
    if (docInsertId) {
      this.ngOnInit();
    } else {
      // translate
      this.sharedMethods.showToast('Failed to save visa');
    }
  }

  getEssentialDocuments() {
    const allDocs = this.documentsDataService.documents;
    return allDocs.filter((doc) => doc.isEssential);
  }

  async addSeamansBook() {
    const image = await this.uploadService.takePicture();
    const now = this.sharedMethods.getCurrentDateTime();
    const saveObj = {
      appRef: this.sharedMethods.generateAppRef(),
      userId: this.userData.id,
      fileName: 'ikan-my-seamans-book',
      fileUrl: image.webPath,
      fileSize:  '',
      docType: image.docType,
      isEssential: true,
      createdAt: now,
      updatedAt: now,
      createdBy: this.userData.id,
      updatedBy: this.userData.id,
    };
    const docInsertId = await this.documentsDataService.create(saveObj);
    if (docInsertId) {
      this.ngOnInit();
    } else {
      // translate
      this.sharedMethods.showToast('Failed to save seamans book');
    }
  }
  
  viewSeamansBook() {}

  addDocument() {}
}
