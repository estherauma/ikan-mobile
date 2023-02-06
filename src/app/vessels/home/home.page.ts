import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { SteponePage } from '../create/stepone/stepone.page';
import { VesselsDataService } from '../data/vessels-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  //TODO: Use translated text from prisimic
  pageTitle = 'Vessels';
  vessels = [];
  filterOptions = [
    {title:'Active Duty', value:'Active Duty'},
    {title:'', value:'opened'}
  ];

  constructor(
    public menuCtrl: MenuController,
    public router: Router,
    public modalController: ModalController,
    public vesselsDataService: VesselsDataService
  ) {
    this.vesselsDataService.getAll().subscribe((data) => {
      this.vessels = data;
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  async createVessel() {
    const modal = await this.modalController.create({
      component: SteponePage,
      cssClass: 'notification-modal'
    });

    modal.present();

    modal.onDidDismiss().then((data) => {
    });
  }

  searchResult(result) {
    this.vessels = result;
  }

  filterResult(result) {
    this.vessels = result;
  }
}
