import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreatepassportPage } from '../createpassport/createpassport.page';

@Component({
  selector: 'app-essentials',
  templateUrl: './essentials.component.html',
  styleUrls: ['./essentials.component.scss'],
})
export class EssentialsComponent  implements OnInit {

  constructor(
    public router: Router,
    public modalController: ModalController,
  ) { }

  ngOnInit() {}

  async addPassport() {
    const modal = await this.modalController.create({
      cssClass: 'notification-modal',
      component: CreatepassportPage,
    });
    modal.present();
    modal.onDidDismiss().then((data) => {});
  }

  addVisa() {}

  addSeamansBook() {}

  addDocument() {}
}
