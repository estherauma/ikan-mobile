import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { ArchivedWoPage } from '../archived-wo/archived-wo.page';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { pageEventNames } from 'src/app/shared/services/analytics/event-names';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

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
  commonText;
  stepOneQtns: any;

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
    public router: Router,
    public analytics: AnalyticsService,
    public sharedMethods: SharedmethodsService
  ) { }

  async ngOnInit() {
    this.commonText = this.contentService.commonText;
    this.editBtnText = this.commonText?.edit;
    this.woTitle = this.commonText?.activeWoTitle;
    this.archivedBtnText = this.commonText?.archivedBtnText;

    this.getParams();

    // For editing form
    const stepOneData = this.contentService.getContentByPropertyName('vessels-createstepone');
    this.stepOneQtns = stepOneData?.formQuestions;
    this.analytics.trackEvent(pageEventNames.viewVessel, this.sharedMethods.analyticsEventParams);
  }

  getParams() {
    this.activatedRoute.params.subscribe((params) => {
      this.vessel = params;
      const status = this.contentService.getFormOptionTranslation('vessels-createsteptwo', 'status', this.vessel.status);
      // TODO: change status to WO status
      this.title = `${this.commonText?.status}: ${status}`;
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

  editVessel() {
    const data = JSON.stringify({
      ...this.vessel,
      app_ref: this.vessel.appRef,
      reg_no: this.vessel.regNo,
      type: this.vessel.vesselType,
      commissioning_date: this.vessel.commissioningDate,
      image_url: this.vessel.imgUrl,
      online_ref: this.vessel.onlineRef,
    });
    const questions = JSON.stringify(this.stepOneQtns);

    this.router.navigate([ 'vessels/create/steptwo', { data, questions } ], { replaceUrl: true, queryParams: { isEditing: true }});
  }
}
