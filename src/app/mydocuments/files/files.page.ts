import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
  modal;
  files = new Array(20).fill({
    name:'FileName.jpg',
    date: 'xx/xx/xxx',
    size:'412kb'
  });
  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }
  searchResult(data){}

  onSelect(){
    this.select = true;
  }
  async onClick(){
    this.actionClicked = true;
    if(this.select){
      this.modal = await this.modalCtrl.create({
        component: DocumentactionsComponent,
        cssClass: 'my-own-class',
      });

      this.modal.present();

      this.modal.onDidDismiss().then((data) => {
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

    this.modal = await this.modalCtrl.create({
      component: DocumentselectedactionComponent,
      cssClass: 'my-own-class',
    });

    this.modal.present();

    this.modal.onDidDismiss().then((data) => {
      console.log('data--->', data);
    });
  }

  onCancel(){
    this.select = false;
  }

  onDismiss(){
    this.modal.dismiss();
    this.actionClicked = false;
  }

}
