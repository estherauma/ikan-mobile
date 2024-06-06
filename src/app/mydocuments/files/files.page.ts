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
import { Filesystem, Directory } from '@capacitor/filesystem';import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

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
  isSelecting: boolean = false;
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
    public socialSharing: SocialSharing,
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

  async addDocument() {
    const newDoc = await this.sharedMethods.addDocument(this.commonText, this.alertController, this.uploadService, this.documentsDataService, this.docsCommonText, false);
    if (newDoc) {
      this.getDocuments();
    }
  }

  async viewImage(doc: DocumentType) {
    if (!this.isSelecting) {
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
    if (!this.isSelecting) {
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

  selectDocs() {
    this.isSelecting = !this.isSelecting;
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
    const alertProps = {
      cssClass: 'del-doc-alert',
      // translate
      header: this.commonText?.delete + ` ${this.selectedDocuments.length} ` +   'Delete docs',
      backdropDismiss: false,
      buttons: [ {
        text: this.commonText?.cancel,
        role: 'cancel',
      },
      {
        text: this.commonText?.delete,
        handler: async() => {
          await this.deleteDocs(this.selectedDocuments).then(async() => {
            this.getDocuments();
            this.isSelecting = false;
            this.sharedMethods.showToast(
              // translate
              `${this.selectedDocuments.length} ` + 'doc(s) deleted', 'short'
              );
            this.selectedDocuments = [];
          });
        }
      }, ]
    };

    const alert = await this.alertController.create(alertProps);
    await alert.present();
  }
  
  async deleteDocs(docs: DocumentType[]) {
    for (const doc of docs) {
      if (doc?.onlineRef) {
        // if doc is synced, the is_deleted field is set to true
        // Doc will be deleted from the device after online reference is deleted
        await this.documentsDataService.updateDocumentField(doc.id, 'is_deleted', 1);
      } else {
        await this.documentsDataService.deleteDocument(doc.id);
      }
    }
    await this.uploadService.deleteDocuments(docs);
  }

  async shareDocs() {
    try {
      const promises = this.selectedDocuments.map(async(doc) => {
        if (doc.docType === 'image') {
          const fileName = doc.fileUrl.split('files/')[1];
          const path = await Filesystem.getUri({
            directory: Directory.Data,
            path: fileName
          });
          return path.uri;
        } else {
          return doc.fileUrl;
        }
      });

      await Promise.all(promises).then(async docsToShare => {
        await this.socialSharing.share(null, null, docsToShare);
      });

      this.selectedDocuments = [];
      this.isSelecting = false;
    } catch (error) {
      console.error(error);
    }
  }
}
