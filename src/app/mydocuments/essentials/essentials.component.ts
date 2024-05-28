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
  docsCommonText: any;
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
    const docsPageData = this.contentService.getContentByPropertyName('my-documents-common-text');
    this.docsCommonText = this.sharedMethods.convertAdditionalTextToObj(docsPageData?.additionalText);
    this.userData = await this.sharedMethods.getUserData();
    await this.getDocDetails();
  }

  async getDocDetails() {
    this.userPassportDetails = await this.documentsDataService.getUserPassport(this.userData.id);
    if (this.userPassportDetails && this.userPassportDetails.imageUrl) {
      this.passportImageUrl = this.userPassportDetails.imageUrl;
    }

    this.allEssentialDocuments = this.getEssentialDocuments();
    // excludes passport, visa & seamans book as they are displayed separately
    this.otherEssentialDocuments = this.getOtherEssentialDocuments();
    
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
      this.getDocDetails();
    });
  }

  async addVisa() {
    const alert =  await this.sharedMethods.getSelectImageOrPdfAlert(this.commonText, this.alertController, this.uploadService, this.docsCommonText);
    await alert.present();
    await alert.onDidDismiss().then(async (data) => {
      if (data.role !== 'cancel' && data.data?.fileData && Object.keys(data?.data?.fileData).length) {
        const { fileData } = data?.data;
        const now = this.sharedMethods.getCurrentDateTime();
        const visaSaveObj = {
          appRef: this.sharedMethods.generateAppRef(),
          userId: this.userData.id,
          fileName: 'ikan-my-visa',
          fileUrl: fileData.docType === 'image' ? fileData.webPath : fileData.uriPath,
          fileSize:  '',
          docType: fileData.docType,
          isEssential: true,
          createdAt: now,
          updatedAt: now,
          createdBy: this.userData.id,
          updatedBy: this.userData.id,
        };
        const docInsertId = await this.documentsDataService.create(visaSaveObj);
        if (docInsertId) {
          this.getDocDetails();
        } else {
          this.sharedMethods.showToast(this.docsCommonText?.saveVisaError);
        }
      }
    });
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
    const alert = await this.sharedMethods.getSelectImageOrPdfAlert(this.commonText, this.alertController, this.uploadService, this.docsCommonText);
    await alert.present();
    await alert.onDidDismiss().then(async (data) => {
      if (data.role !== 'cancel' && data.data?.fileData && Object.keys(data?.data?.fileData).length) {
        const { fileData } = data?.data;
        const now = this.sharedMethods.getCurrentDateTime();
        const saveObj = {
          appRef: this.sharedMethods.generateAppRef(),
          userId: this.userData.id,
          fileName: 'ikan-my-seamans-book',
          fileUrl: fileData.docType === 'image' ? fileData.webPath : fileData.uriPath,
          fileSize:  '',
          docType: fileData.docType,
          isEssential: true,
          createdAt: now,
          updatedAt: now,
          createdBy: this.userData.id,
          updatedBy: this.userData.id,
        };
        const docInsertId = await this.documentsDataService.create(saveObj);
        if (docInsertId) {
          this.getDocDetails();
        } else {
          this.sharedMethods.showToast(this.docsCommonText?.saveSeamansBookError);
        }
      }
    });
  }

  async addEssentialDocument() {
    const newDoc = await this.sharedMethods.addDocument(this.commonText, this.alertController, this.uploadService, this.documentsDataService, this.docsCommonText, true);
    if (newDoc) {
      this.otherEssentialDocuments = this.getOtherEssentialDocuments();
    }
  }
}
