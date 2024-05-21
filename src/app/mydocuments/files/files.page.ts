import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { ConfirmmodalComponent } from 'src/app/shared/components/confirmmodal/confirmmodal.component';
import { DocumentactionsComponent } from 'src/app/shared/components/documentactions/documentactions.component';
import { DocumentselectedactionComponent } from 'src/app/shared/components/documentselectedaction/documentselectedaction.component';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { Document } from 'src/app/shared/types/types';

@Component({
  selector: 'app-files',
  templateUrl: './files.page.html',
  styleUrls: ['./files.page.scss'],
})
export class FilesPage implements OnInit {
  select = false;
  actionClicked = false;
  display: 'list' | 'icon' = 'list';
  allActionModal;
  documentSelectedModal;
  confirmModal;
  documents: Document[] = new Array(3).fill({
    name:'TestImage.jpg',
    date: '2024-05-15T13:43:17.714788+03:00',
    size:'412kb',
    id: Math.random(),
    userId: 1,
    type: 'image',
    url: 'assets/icon/boat_with_blue_bg.svg',
    createdAt: '2024-05-15T13:43:17.714788+03:00',
    createdBy: 3,
    updatedAt: '2024-05-15T13:43:17.714788+03:00',
    updatedBy: 3,
  });


  isEditing = false;
  selectedDocuments: Document[] = [];
  commonText: any;
  
  constructor(
    public modalCtrl: ModalController,
    public router: Router,
    public platform: Platform,
    public sharedMethods: SharedmethodsService,
    public contentService: ContentService,
    public alertController: AlertController,
    // public fileOpener: FileOpener,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService.commonText;
    const otherDocs = new Array(4).fill({
      name:'TestPdf.jpg',
      date: '2024-05-15T13:43:17.714788+03:00',
      size:'412kb',
      id: Math.random(),
      userId: 1,
      type: 'pdf',
      url: 'assets/icon/boat_with_blue_bg.svg',
      createdAt: '2024-05-15T13:43:17.714788+03:00',
      createdBy: 3,
      updatedAt: '2024-05-15T13:43:17.714788+03:00',
      updatedBy: 3,
    });
    this.documents = [...this.documents, ...otherDocs]
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

  viewImage(doc: Document) {}

  viewFile(doc) {}

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
    const alertProps = {
      cssClass: 'del-doc-alert',
      header: this.commonText?.delete + ` ${this.selectedDocuments.length} ` + this.commonText?.imageOrDoc || 'Delete docs',
      backdropDismiss: false,
      buttons: [ {
        text: this.commonText?.cancel?.toUpperCase(),
        role: 'cancel',
      },
      {
        text: this.commonText?.delete?.toUpperCase(),
        handler: async() => {}
      }, ]
    };

    const alert = await this.alertController.create(alertProps);
    await alert.present();
  }

  async shareDocs() {}

  async deleteDocs(docs: Document[]) {}
}
