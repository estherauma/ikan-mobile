import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ConfirmmodalComponent } from 'src/app/shared/components/confirmmodal/confirmmodal.component';
import { DocumentactionsComponent } from 'src/app/shared/components/documentactions/documentactions.component';
import { DocumentselectedactionComponent } from 'src/app/shared/components/documentselectedaction/documentselectedaction.component';

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
  files = new Array(20).fill({
    name:'FileName.jpg',
    date: 'xx/xx/xxx',
    size:'412kb'
  });
  constructor(
    public modalCtrl: ModalController,
    public router: Router
  ) { }

  ngOnInit() {
  }
  searchResult(data){}

  onSelect(){
    this.select = true;
  }
  async onClick(){
    this.actionClicked = true;
    if(!this.select){
      this.allActionModal = await this.modalCtrl.create({
        component: DocumentactionsComponent,
        cssClass: 'my-own-class',
      });

      this.allActionModal.present();

      this.allActionModal.onDidDismiss().then((data) => {
        const view = data.data.view;

        if(view === 'icons'){
          this.display = 'icon';
          return;
        }
        if(view === 'list'){
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

    this.documentSelectedModal.onDidDismiss().then( async (data) => {
      const action = data.data.action;

      if (action === 'delete'){
        this.confirmModal = await this.modalCtrl.create({
          component: ConfirmmodalComponent,
          componentProps: {
            title: 'Permanently delete?',
            description: 'Lorem ipsum',
          },
          cssClass: 'tuna-modal'
        });
        this.confirmModal.present();

        this.confirmModal.onDidDismiss().then(async (confirmModalData) => {
          //TODO: handle action on confirm deletion
        });
      };
    });
  }

  onCancel(){
    this.select = false;
  }

  onDismiss(){
    this.actionClicked = false;
    if(!this.select){
      this.allActionModal.dismiss();
    }else{
      this.documentSelectedModal.dismiss();
    }
  }

  onGoToEssentials(){
    this.router.navigate(['mydocuments/home']);
  }

  onGoToFiles(){
    this.router.navigate(['mydocuments/files']);
  }

}
