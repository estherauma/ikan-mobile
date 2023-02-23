import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { ArchivedWoPage } from '../archived-wo/archived-wo.page';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  pageTitle = 'Vessel Details';
  vessel: any;
  title;
  woTitle = '';
  editBtnText = '';
  archivedBtnText = '';

  workOrders = [
    {
      appRef: 'ref1234',
      createdAt: '2023-01-30 13:09:03',
      createdBy: '-NHx56Ppqi1o6C_qKxBJ',
      id: 1,
      internalRef: 'ref1234',
      name: 'work or 1',
      status: 'Open',
      updatedAt: '2023-01-30 13:09:03',
      updatedBy: '-NHx56Ppqi1o6C_qKxBJ'
    }
];
  constructor(
    public activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public contentService: ContentService,
  ) { }

  async ngOnInit() {
    await this.getParams();

    this.editBtnText = this.contentService.commonText?.edit;
    this.woTitle = this.contentService.commonText?.activeWoTitle;
    this.archivedBtnText = this.contentService.commonText?.archivedBtnText;
  }

  getParams() {
    this.activatedRoute.params.subscribe((params) => {
      this.vessel = params;
      this.title = `Status: ${this.vessel.status}`;
    });
  }

  async viewArchieved() {
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
