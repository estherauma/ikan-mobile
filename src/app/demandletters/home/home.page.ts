import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreatePage } from '../create/create.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pageTitle="Demand Letters"
  bannerImage="https://cdn.pixabay.com/photo/2016/11/30/20/44/computer-1873831_1280.png"

  demandLetters = [
    {
      name: 'Demand letter',
      internalRef: 'IJSWERWXDWER',
      appRef: 'XXX-XXX-XXX',
      dateOpened: '2022-10-23',
      status: 'Open',
      image: "https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg",
    },
    {
      name: 'Demand letter',
      internalRef: 'IJSWERWXDWER',
      appRef: 'XXX-XXX-XXX',
      dateOpened: '2022-10-23',
      status: 'Open',
      image: "https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg",
    }
  ]

  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  async createDemandLetter () {
    const modal = await this.modalCtrl.create({
      component: CreatePage,
      cssClass: 'tuna-modal',
    });

    modal.present();

    modal.onDidDismiss().then((data) => {});
  }

}
