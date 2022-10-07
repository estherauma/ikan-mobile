import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { CreatePage } from '../create/create.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  //TODO: Use translated text from prismic
  pageTitle = 'Work Orders';
  workOrders = [
    {
      name: 'Work order 1',
      internalRef: 'IWXDWER8234',
      dateOpened: '2022-10-23',
      status: 'Open',
      appRef: 'XXX-XXX-XXX',
    },
    {
      name: 'Work order 2',
      internalRef: 'IJSWERWXDWER',
      dateOpened: '2022-10-15',
      status: 'Open',
      appRef: 'XXX-XXX-XXX'
    },
    {
      name: 'Work order 3',
      internalRef: 'IJSWERWXDWER8234',
      dateOpened: '2022-10-10',
      status: 'Open',
      appRef: 'XXX-XXX-XXX'
    }
];


  constructor(
    public menuCtrl: MenuController,
    public router: Router,
    public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  async createWorkOrder() {
    const modal = await this.modalCtrl.create({
      component: CreatePage,
      cssClass: 'tuna-modal',

    });
    modal.present();

    modal.onDidDismiss().then((data) => {});
  }

  viewDetails(workOrder) {
    this.router.navigate(['/workorders/view', workOrder]);
  }
}
