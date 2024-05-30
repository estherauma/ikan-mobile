import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { DocumentType } from 'src/app/shared/types/types';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { ViewImageComponent } from '../view-image/view-image.component';
import { UploadService } from 'src/app/shared/services/upload/upload.service';
import { DocumentsDataService } from '../data/documents-data.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.page.html',
  styleUrls: ['./files.page.scss'],
})
export class FilesPage implements OnInit {
  select = false;
  actionClicked = false;
  // TODO: add display logic
  display: 'list' | 'icon' = 'list';
  allActionModal;
  documentSelectedModal;
  confirmModal;
  documents: DocumentType[] = [];
  isEditing = false;
  selectedDocuments: DocumentType[] = [];
  commonText: any;
  docsCommonText: any;
  
  constructor(
    public modalCtrl: ModalController,
    public router: Router,
    public platform: Platform,
    public sharedMethods: SharedmethodsService,
    public contentService: ContentService,
    public alertController: AlertController,
    public fileOpener: FileOpener,
    public documentsDataService: DocumentsDataService,
    public uploadService: UploadService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService.commonText;
    const docsPageData = this.contentService.getContentByPropertyName('my-documents-common-text');
    this.docsCommonText = this.sharedMethods.convertAdditionalTextToObj(docsPageData?.additionalText);
    this.getDocuments();
  }

  getDocuments() {
    this.documents = this.documentsDataService.documents;
    this.documents = this.documents.filter((doc) => !doc.isEssential) || this.documents;
  }

  searchResult(data) {}

  // TODO: new doc not reflecting. Need to refactor
  async addDocument() {
    const newDoc = await this.sharedMethods.addDocument(this.commonText, this.alertController, this.uploadService, this.documentsDataService, this.docsCommonText, false);
    if (newDoc) {
      this.getDocuments();
    }
  }

  async viewImage(doc: DocumentType) {
    if (!this.isEditing) {
      const modal = await this.modalCtrl.create({
        cssClass: 'notification-modal view-image',
        component: ViewImageComponent,
        componentProps: {
          imageFile: doc,
        }
      });

      modal.present();
    }
  }

  viewFile(doc: DocumentType) {
    if (!this.isEditing) {
      if (this.sharedMethods.currentPlatform === 'web') {
        window.open(doc.fileUrl, '_blank');
      } else {
        this.fileOpener.open(doc.fileUrl, 'application/pdf')
        .then(() => console.log('File is opened'))
        .catch(e => {
          console.log('Error opening file', e);
          this.sharedMethods.showToast(this.docsCommonText?.errorOpeningFile);
        });
      }
    }
  }

  editDocuments() {
    this.isEditing = !this.isEditing;
    this.selectedDocuments = [];
  }

  selectDocument(doc) {
    const index = this.selectedDocuments.indexOf(doc);
    if (index === -1) {
      this.selectedDocuments.push(doc);
    } else {
      this.selectedDocuments.splice(index, 1);
    }
  }

  unSelectDocument(doc) {
    const index = this.selectedDocuments.indexOf(doc);
    this.selectedDocuments.splice(index, 1);
  }

  async openDelAlert() {
    // TODO: to refactor
    // const alertProps = {
    //   cssClass: 'del-doc-alert',
    //   header: this.commonText?.delete + ` ${this.selectedDocuments.length} ` + this.commonText?.imageOrDoc || 'Delete docs',
    //   backdropDismiss: false,
    //   buttons: [ {
    //     text: this.commonText?.cancel?.toUpperCase(),
    //     role: 'cancel',
    //   },
    //   {
    //     text: this.commonText?.delete?.toUpperCase(),
    //     handler: async() => {}
    //   }, ]
    // };

    // const alert = await this.alertController.create(alertProps);
    // await alert.present();
  }

  async shareDocs() {}

  async deleteDocs(docs: Document[]) {}
}
