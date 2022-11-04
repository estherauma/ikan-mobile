import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { SteponePage } from '../create/stepone/stepone.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  //TODO: Use translated text from prisimic
  pageTitle = 'Vessels';

  vessels = [
    {
      name: 'Vessel 1',
      regNo: 'XWERS-WWER',
      status: 'Active Duty',
      type: 'Type 2',
      imgUrl: '/assets/imgs/vessel.jpeg',
      capacity: 30,
      age: 10
    },
    {
      name: 'Vessel 2',
      regNo: 'XWERS-WWER',
      status: 'Active Duty',
      type: 'Type 1',
      imgUrl: '/assets/imgs/vessel.jpeg',
      capacity: 40,
      age: 11
    },
    {
      name: 'Vessel 3',
      regNo: 'XWERS-WWER',
      status: 'Active Duty',
      type: 'Type 1',
      imgUrl: '/assets/imgs/vessel.jpeg',
      capacity: 30,
      age: 16
    }
  ];

  constructor(
    public menuCtrl: MenuController,
    public router: Router,
    public modalController: ModalController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  async createVessel() {
    const modal = await this.modalController.create({
      component: SteponePage,
      cssClass: 'tuna-modal'
    });

    modal.present();

    modal.onDidDismiss().then((data) => {
    });
  }

  viewDetails(vessel) {
    this.router.navigate(['vessels/view', vessel]);
  }
}
