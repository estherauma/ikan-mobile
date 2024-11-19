import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { VesselsDataService } from 'src/app/vessels/data/vessels-data.service';
import { PaymentsDataService } from '../../data/payments-data.service';
import { UserData, StorageKeys } from 'src/app/shared/types/api-types';

type GroupedVesselPayments = {
  date: string;
  payments: any[];
  isExpanded: boolean;
};

@Component({
  selector: 'app-vessel-payments',
  templateUrl: './vessel-payments.page.html',
  styleUrls: ['./vessel-payments.page.scss'],
})
export class VesselPaymentsPage implements OnInit {
  commonText: any;
  currentUser: UserData;
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
  groupedVesselPayments: GroupedVesselPayments[] = [];

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
      this.currentUser = await this.sharedMethods.readDataFromStorage(
        StorageKeys.userData
      );
      this.vesselPayments = data.filter(
        (payment) => payment.createdBy === this.currentUser.id
      );
      // group vessel payments by date
      this.groupedVesselPayments = this.groupPaymentsByDate(
        this.vesselPayments
      );
    });
  }

  async ngOnInit() {
    this.commonText = await this.contentService?.commonText;
    // translate
    this.pageTitle = this.commonText?.vesselPayments;
  }

  groupPaymentsByDate(payments) {
    const grouped = payments.reduce((acc, payment) => {
      // TODO: check whether to use created date or date
      const date = new Date(payment.date).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(payment);
      return acc;
    }, {});

    const vesselPayments = Object.keys(grouped).map((date) => ({
      date,
      payments: grouped[date],
      isExpanded: false,
    }));

    return vesselPayments;
  }

  toggleGroup(index: number) {
    this.groupedVesselPayments[index].isExpanded =
      !this.groupedVesselPayments[index].isExpanded;
  }

  filterResult(result) {}

  goToPaymentDetail(payment) {}
}
