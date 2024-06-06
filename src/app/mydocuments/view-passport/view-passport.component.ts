import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { UploadService } from 'src/app/shared/services/upload/upload.service';
import { DocumentsDataService } from '../data/documents-data.service';
import { CreatepassportPage } from '../createpassport/createpassport.page';

@Component({
  selector: 'app-view-passport',
  templateUrl: './view-passport.component.html',
  styleUrls: ['./view-passport.component.scss'],
})
export class ViewPassportComponent  implements OnInit {
  userPassportDetails;
  passportViewData;
  docsCommonText: any;
  commonText: any;
  
  constructor(
    public sharedMethods: SharedmethodsService,
    public modalController: ModalController,
    public contentService: ContentService,
    public alertController: AlertController,
    public uploadService: UploadService,
    public documentsDataService: DocumentsDataService,
  ) { }

  ngOnInit() {
    const docsPageData = this.contentService.getContentByPropertyName('my-documents-common-text');
    this.docsCommonText = this.sharedMethods.convertAdditionalTextToObj(docsPageData?.additionalText);
    this.commonText = this.contentService.commonText;
  }

  closeView() {
    this.modalController.dismiss();
  }

  async editPassport(passport) {
    const modal = await this.modalController.create({
      cssClass: 'notification-modal',
      component: CreatepassportPage,
      componentProps: {
        passportData: passport,
        isEditing: true,
      }
    });
    modal.present();
    modal.onDidDismiss().then((data) => {
      if(data?.data?.passportData) {
        this.userPassportDetails = {...this.userPassportDetails, ...data.data.passportData};
      }
    });
  }

  async deletePassport(passport) {
    const deleteAlert = await this.alertController.create({
      cssClass: 'del-doc-alert',
      header: this.docsCommonText?.deletePassport,
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
            await this.deleteDocument(passport).then(() => {
              this.modalController.dismiss();
              this.sharedMethods.showToast(this.docsCommonText?.passportDeletedSuccessfully);
            });
          }
        },
      ]
    });
    await deleteAlert.present();
  }

  async deleteDocument(passport) {
    if (passport?.onlineRef) {
      await this.documentsDataService.updatePassportField(passport.id, 'is_deleted', 1).then(async() => {
        await this.documentsDataService.updateDocumentField(passport.documentId, 'is_deleted', 1);
      });
    } else {
      await this.documentsDataService.deletePassport(passport.id).then(async() => {
        await this.documentsDataService.deleteDocument(passport.documentId);
      });
    }
    passport.fileUrl = passport.imageUrl;
    const docs = [passport];
    await this.uploadService.deleteDocuments(docs);
  }
}
