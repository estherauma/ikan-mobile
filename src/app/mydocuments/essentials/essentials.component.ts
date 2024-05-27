import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
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
  allEssentialDocuments: any = [];
  otherEssentialDocuments: any = []; // excludes passport, visa & seamans book as they are displayed separately

  constructor(
    public router: Router,
    public modalController: ModalController,
    public documentsDataService: DocumentsDataService,
    public sharedMethods: SharedmethodsService,
    public contentService: ContentService,
    public uploadService: UploadService,
    public alertController: AlertController,
  ) { }

  async ngOnInit() {
    this.commonText = this.contentService.commonText;
    this.userData = await this.sharedMethods.getUserData();
    this.userPassportDetails = await this.documentsDataService.getUserPassport(this.userData.id);
    if (this.userPassportDetails && this.userPassportDetails.imageUrl) {
      this.passportImageUrl = this.userPassportDetails.imageUrl;
    }

    this.allEssentialDocuments = this.getEssentialDocuments();
    // excludes passport, visa & seamans book as they are displayed separately
    this.otherEssentialDocuments = this.getOtherEssentialDocuments();
    console.log('this.otherEssentialDocuments', this.otherEssentialDocuments);
    
    this.userVisaDetails = this.allEssentialDocuments.find((doc) => doc.fileName === 'ikan-my-visa');
    this.visaImageUrl = this.userVisaDetails?.fileUrl || '';
    this.userSeamansBookDetails = this.allEssentialDocuments.find((doc) => doc.fileName === 'ikan-my-seamans-book');
    this.seamansBookImageUrl = this.userSeamansBookDetails?.fileUrl || '';
  }

  // TODO: add edit passport
  // TODO: add passport, visa, seamans book and other essential docs view
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
  
  getOtherEssentialDocuments() {
    const allEssentialDocuments = this.getEssentialDocuments();
    // excludes passport, visa & seamans book as they are displayed separately
    return allEssentialDocuments.filter((doc) => doc.fileName !== 'ikan-my-passport' && doc.fileName !== 'ikan-my-visa' && doc.fileName !== 'ikan-my-seamans-book');
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

  // TODO: new doc not reflecting.
  async addEssentialDocument() {
    const newDoc = await this.sharedMethods.addDocument(this.commonText, this.alertController, this.uploadService, this.documentsDataService, true);
    if (newDoc) {
      const aaaaaa = [newDoc, ...this.otherEssentialDocuments];
      this.otherEssentialDocuments = this.getOtherEssentialDocuments();
      console.log('this.otherEssentialDocuments', this.otherEssentialDocuments);
      // await this.ngOnInit();
    }
  }
}
