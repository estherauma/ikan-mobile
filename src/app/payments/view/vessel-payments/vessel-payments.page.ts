import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { VesselsDataService } from 'src/app/vessels/data/vessels-data.service';
import { PaymentsDataService } from '../../data/payments-data.service';
import { UserData, StorageKeys } from 'src/app/shared/types/api-types';

@Component({
  selector: 'app-vessel-payments',
  templateUrl: './vessel-payments.page.html',
  styleUrls: ['./vessel-payments.page.scss'],
})
export class VesselPaymentsPage implements OnInit {
  commonText: any;
  vessel: any;
  pageTitle = 'Payments';
  filterOptions = [
    { title: 'closed', value: 'closed' },
    { title: 'opened', value: 'opened' },
  ];
  filterDataSet = [
    {
      name: 'Vessel Company One',
      status: 'Opened',
    },
    {
      name: 'Vessel Company Two',
      status: 'Closed',
    },
    {
      name: 'Vessel Company Three',
      status: 'Opened',
    },
    {
      name: 'Vessel Company Four',
      status: 'Closed',
    },
  ];
  unFilteredData = [];
  vesselPayments = [];

  constructor(
    public router: Router,
    public contentService: ContentService,
    public vesselsDataService: VesselsDataService,
    public paymentsDataService: PaymentsDataService,
    public sharedMethods: SharedmethodsService,
    public activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params?.vessel) {
        this.vessel = JSON.parse(params.vessel);
      }
    });
    this.paymentsDataService.getAll().subscribe(async (data) => {
      const user: UserData = await this.sharedMethods.readDataFromStorage(
        StorageKeys.userData
      );
      // TODO: filter by date
      this.vesselPayments = data.filter(
        (payment) => payment.createdBy === user.id
      );
    });
  }

  async ngOnInit() {
    this.commonText = await this.contentService?.commonText;
    // translate
    this.pageTitle = this.commonText?.vesselPayments;
  }

  filterResult(result) {}

  goToPaymentDetail(payment) {}
}
