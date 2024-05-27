import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { ConfirmmodalComponent } from 'src/app/shared/components/confirmmodal/confirmmodal.component';
import { DocumentactionsComponent } from 'src/app/shared/components/documentactions/documentactions.component';
import { DocumentselectedactionComponent } from 'src/app/shared/components/documentselectedaction/documentselectedaction.component';
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
    this.documents = this.documentsDataService.documents;
    this.documents = this.documents.filter((doc) => !doc.isEssential) || this.documents;
  }
  searchResult(data) {}

  onSelect() {
    this.select = true;
  }
  async onClick() {
    this.actionClicked = true;
    if (!this.select) {
      this.allActionModal = await this.modalCtrl.create({
        component: DocumentactionsComponent,
        cssClass: 'my-own-class',
      });

      this.allActionModal.present();

      this.allActionModal.onDidDismiss().then((data) => {
        const view = data.data.view;

        if (view === 'icons') {
          this.display = 'icon';
          return;
        }
        if (view === 'list') {
          this.display = 'list';
          return;
        }
      });
      return;
    }

    this.documentSelectedModal = await this.modalCtrl.create({
      component: DocumentselectedactionComponent,
      cssClass: 'my-own-class',
    });

    this.documentSelectedModal.present();

    this.documentSelectedModal.onDidDismiss().then( async(data) => {
      const action = data.data.action;

      if (action === 'delete') {
        this.confirmModal = await this.modalCtrl.create({
          component: ConfirmmodalComponent,
          componentProps: {
            title: 'Permanently delete?',
            description: 'Lorem ipsum',
          },
          cssClass: 'tuna-modal'
        });
        this.confirmModal.present();

        this.confirmModal.onDidDismiss().then(async(confirmModalData) => {
          //TODO: handle action on confirm deletion
        });
      };
    });
  }

  onCancel() {
    this.select = false;
  }

  onDismiss() {
    this.actionClicked = false;
    if (!this.select) {
      this.allActionModal.dismiss();
    } else {
      this.documentSelectedModal.dismiss();
    }
  }

  // TODO: new doc not reflecting. Need to refactor
  async addDocument() {
    const newDoc = await this.sharedMethods.addDocument(this.commonText, this.alertController, this.uploadService, this.documentsDataService, false);
    if (newDoc) {
      this.documents = [newDoc, ...this.documents];
      await this.ngOnInit();
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
        .catch(e => console.log('Error opening file', e));
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
