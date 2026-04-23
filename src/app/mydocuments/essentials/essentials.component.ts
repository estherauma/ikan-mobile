import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { CreatepassportPage } from '../createpassport/createpassport.page';
import { DocumentsDataService } from '../data/documents-data.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { UploadService } from 'src/app/shared/services/upload/upload.service';
import { DocumentType } from 'src/app/shared/types/types';
import { ViewImageComponent } from '../view-image/view-image.component';
import { ViewPassportComponent } from '../view-passport/view-passport.component';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';
import { SyncService } from 'src/app/shared/services/sync/sync.service';

@Component({
    selector: 'app-essentials',
    templateUrl: './essentials.component.html',
    styleUrls: ['./essentials.component.scss'],
    standalone: false
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
  otherEssentialDocuments: any = []; // excludes passport, visa, seamans book & insurance doc as they are displayed separately
  isEditing: boolean = false;
  passportViewData: any = {};
  hasPassportDetails: boolean = false;
  currentLanguage = 'en-us';
  insuranceDocDetails: any;
  insuranceDocImageUrl: string = '';

  @Output() progressDataChange = new EventEmitter<any>();

  constructor(
    public router: Router,
    public modalController: ModalController,
    public documentsDataService: DocumentsDataService,
    public sharedMethods: SharedmethodsService,
    public contentService: ContentService,
    public uploadService: UploadService,
    public alertController: AlertController,
    public syncService: SyncService,
  ) { }

  async ngOnInit() {
    this.commonText = this.contentService.commonText;
    this.currentLanguage = this.contentService.currentLanguage;
    const docsPageData = this.contentService.getContentByPropertyName('my-documents-common-text');
    this.docsCommonText = this.sharedMethods.convertAdditionalTextToObj(docsPageData?.additionalText);
    this.userData = await this.sharedMethods.getUserData();
    await this.getDocDetails();
    this.passportViewData = this.getPassportViewData();
  }

  async getDocDetails() {
    this.userPassportDetails = await this.documentsDataService.getUserPassport(this.userData.id);
    this.hasPassportDetails = !!this.userPassportDetails;
    if (this.userPassportDetails && this.userPassportDetails.imageUrl) {
      this.passportImageUrl = this.userPassportDetails.imageUrl;
    } else {
      this.passportImageUrl = '';
    }

    this.allEssentialDocuments = this.getEssentialDocuments();
    // excludes passport, visa, seamans book & insurance doc as they are displayed separately
    this.otherEssentialDocuments = this.getOtherEssentialDocuments();
    
    this.userVisaDetails = this.allEssentialDocuments.find((doc) => doc.fileName === 'ikan-my-visa');
    this.visaImageUrl = this.userVisaDetails?.fileUrl || '';
    this.userSeamansBookDetails = this.allEssentialDocuments.find((doc) => doc.fileName === 'ikan-my-seamans-book');
    this.seamansBookImageUrl = this.userSeamansBookDetails?.fileUrl || '';
    this.insuranceDocDetails = this.allEssentialDocuments.find((doc) => doc.fileName === 'ikan-insurance-document');
    this.insuranceDocImageUrl = this.insuranceDocDetails?.fileUrl || '';

    const progressData = this.getProgressData();
    this.progressDataChange.emit(progressData);
  }

  getProgressData() {
    const totalEssentialDocs = 4; // passport, visa, seamans book, insurance doc
    let uploadedDocsCount = 0;
    if (this.userPassportDetails) {
      uploadedDocsCount++;
    }
    if (this.userVisaDetails) {
      uploadedDocsCount++;
    }
    if (this.userSeamansBookDetails) {
      uploadedDocsCount++;
    }
    if (this.insuranceDocDetails) {
      uploadedDocsCount++;
    }
    return {
      total: totalEssentialDocs,
      uploaded: uploadedDocsCount,
      progress: (uploadedDocsCount / totalEssentialDocs) * 100
    };
  }

  async addPassport() {
    const modal = await this.modalController.create({
      cssClass: 'notification-modal',
      component: CreatepassportPage,
    });
    modal.present();
    modal.onDidDismiss().then(async(data) => {
      await this.getDocDetails();
    });
  }

  async addVisa() {
    const alert =  await this.sharedMethods.getSelectImageOrPdfAlert(this.commonText, this.alertController, this.uploadService, this.docsCommonText);
    await alert.present();
    await alert.onDidDismiss().then(async (data) => {
      if (data.role !== 'cancel' && data.data?.fileData && Object.keys(data?.data?.fileData).length) {
        const { fileData } = data?.data;
        const now = new Date().toISOString();
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
          await this.getDocDetails();
          await this.syncService.syncMyDocuments();
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
    // excludes passport, visa, seamans book & insurance doc as they are displayed separately
    return allEssentialDocuments.filter((doc) => doc.fileName !== 'ikan-my-passport' &&
                                              doc.fileName !== 'ikan-my-visa' &&
                                              doc.fileName !== 'ikan-my-seamans-book' &&
                                            doc.fileName !== 'ikan-insurance-document');
  }

  async addSeamansBook() {
    const alert = await this.sharedMethods.getSelectImageOrPdfAlert(this.commonText, this.alertController, this.uploadService, this.docsCommonText);
    await alert.present();
    await alert.onDidDismiss().then(async (data) => {
      if (data.role !== 'cancel' && data.data?.fileData && Object.keys(data?.data?.fileData).length) {
        const { fileData } = data?.data;
        const now = new Date().toISOString();
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
          await this.getDocDetails();
          await this.syncService.syncMyDocuments();
        } else {
          this.sharedMethods.showToast(this.docsCommonText?.saveSeamansBookError);
        }
      }
    });
  }

  async addInsuranceDoc() {
    const alert = await this.sharedMethods.getSelectImageOrPdfAlert(this.commonText, this.alertController, this.uploadService, this.docsCommonText);
    await alert.present();
    await alert.onDidDismiss().then(async (data) => {
      if (data.role !== 'cancel' && data.data?.fileData && Object.keys(data?.data?.fileData).length) {
        const { fileData } = data?.data;
        const now = new Date().toISOString();
        const saveObj = {
          appRef: this.sharedMethods.generateAppRef(),
          userId: this.userData.id,
          fileName: 'ikan-insurance-document',
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
          await this.getDocDetails();
          await this.syncService.syncMyDocuments();
        } else {
          this.sharedMethods.showToast(this.docsCommonText?.saveInsuranceDocError || 'Insurance doc error');
        }
      }
    });
  }

  async addEssentialDocument() {
    const newDoc = await this.sharedMethods.addDocument(this.commonText, this.alertController, this.uploadService, this.documentsDataService, this.docsCommonText, true);
    if (newDoc) {
      this.otherEssentialDocuments = this.getOtherEssentialDocuments();
      await this.syncService.syncMyDocuments();
    }
  }

  async viewImage(doc: DocumentType) {
    if (!this.isEditing) {
      const modal = await this.modalController.create({
        cssClass: 'notification-modal view-image',
        component: ViewImageComponent,
        componentProps: {
          imageFile: doc,
        }
      });

      modal.present();
    }
  }

  async viewFile(doc: DocumentType) {
    if (!this.isEditing) {
      if (this.sharedMethods.currentPlatform === 'web') {
        window.open(doc.fileUrl, '_blank');
      } else {
        await FileOpener.openFile({ path: doc.fileUrl})
          .catch((e) => {
            console.log('Error opening file', e);
            this.sharedMethods.showToast(this.docsCommonText?.errorOpeningFile);
          });
      }
    }
  }

  async viewPassportDetails() {
    const modal = await this.modalController.create({
      cssClass: 'notification-modal view-passport',
      component: ViewPassportComponent,
      componentProps: {
        userPassportDetails: this.userPassportDetails,
        passportViewData: this.passportViewData,
      }
    });
    await modal.present();
    await modal.onDidDismiss().then(async(data) => {
      await this.getDocDetails();
    });
  }

  getPassportViewData() {
    const passportPageData = this.contentService.getContentByPropertyName('createpassport');
    const passportFormQuestions = passportPageData?.formQuestions;
    const viewData = {};
    passportFormQuestions?.forEach((entry) => {
      viewData[entry.key] = entry?.label;
    });
    return viewData;
  }

  async handleDeleteDocument(doc: DocumentType, headerText:string = this.docsCommonText?.deleteDocument) {
    const deleteAlert = await this.alertController.create({
      cssClass: 'del-doc-alert',
      header: headerText,
      message: this.docsCommonText?.deletePrompt,
      backdropDismiss: false,
      buttons: [
        {
          text: this.commonText?.cancel,
          role: 'cancel',
        },
        {
          text: this.commonText?.delete,
          handler: async () => {
            await this.deleteDocument(doc).then(async() => {
              await this.getDocDetails();
              this.sharedMethods.showToast(this.docsCommonText?.docDeletedSuccessfully);
            });
          }
        },
      ]
    });
    await deleteAlert.present();
  }

  async deleteDocument(doc: DocumentType) {
    if (doc?.onlineRef) {
      // if doc is synced, the is_deleted field is set to true
      // Doc will be deleted from the device after online reference is deleted
      await this.documentsDataService.updateDocumentField(doc.id, 'is_deleted', 1);
    } else {
      await this.documentsDataService.deleteDocument(doc.id);
    }
    await this.syncService.syncMyDocuments();

    const docs = [doc];
    await this.uploadService.deleteDocuments(docs);
  }
}
