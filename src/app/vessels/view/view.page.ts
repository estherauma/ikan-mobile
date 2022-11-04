import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ArchivedWoPage } from '../archived-wo/archived-wo.page';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  pageTitle = 'Vessel Details';
  vessel: any;

  workOrders = [
    {
      name: 'Work order 1',
      internalRef: 'IWXDWER8234',
      dateOpened: '2022-10-23',
      status: 'Open',
      appRef: 'XXX-XXX-XXX',
    }
];
  constructor(
    public activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    await this.getParams();
  }

  getParams() {
    this.activatedRoute.params.subscribe((params) => {
      this.vessel = params;
    });
  }

  async viewArchieved(){
    const modal = await this.modalCtrl.create({
      component: ArchivedWoPage,
      cssClass: 'tuna-modal',
      componentProps: {
        vessel: this.vessel,
        workOrders: this.workOrders
      }
    });
    modal.present();
    modal.onDidDismiss().then(() => {

    });
  }

}
