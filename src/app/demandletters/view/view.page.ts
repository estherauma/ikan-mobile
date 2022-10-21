import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SelectPage } from 'src/app/workorders/select/select.page';
import { DemandLetter } from '../home/home.page';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  pageTitle = "View Demand Letter"
  demandLetter: DemandLetter

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
    }
  ]

  constructor(
    private activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.pageTitle = params.name
      this.demandLetter = params as DemandLetter
    })
  }

  async addWorkOrder(){
      // this.router.navigate(["workorders/select"])

      const modal = await this.modalCtrl.create({
        component: SelectPage,
        cssClass: 'tuna-modal',
  
      });
      modal.present();
  
      modal.onDidDismiss().then((data) => {});
  }

}
