import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BadgeinfoPage } from '../badgeinfo/badgeinfo.page';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {
  todos = new Array(4).fill(
    {
      name: 'Todo title',
      detail: 'Sed hendrerit neque ut ante imperdiet...'
    });
  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  async onDetails(){
    const modal = await this.modalCtrl.create({
      component: BadgeinfoPage,
      componentProps: {
        completed: false
      },
      cssClass: 'tuna-modal'
    });

    modal.present();
    modal.onDidDismiss().then((data) => {
      // TODO: handle action from badge info
    });
  }

}
