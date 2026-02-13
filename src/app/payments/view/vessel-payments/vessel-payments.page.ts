import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { VesselsDataService } from 'src/app/vessels/data/vessels-data.service';
import { PaymentsDataService } from '../../data/payments-data.service';
import { UserData, StorageKeys } from 'src/app/shared/types/api-types';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';
import { firstValueFrom } from 'rxjs';

type GroupedVesselPayments = {
  date: string;
  payments: any[];
  isExpanded: boolean;
};

@Component({
    selector: 'app-vessel-payments',
    templateUrl: './vessel-payments.page.html',
    styleUrls: ['./vessel-payments.page.scss'],
    standalone: false
})
export class VesselPaymentsPage implements OnInit {
  commonText: any;
  paymentsCommonText: any;
  currentUser: UserData;
  currentLanguage = 'en-us';
  vessel: any;
  pageTitle = 'Vessel Payments';
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
  allUsers = [];

  constructor(
    public router: Router,
    public contentService: ContentService,
    public vesselsDataService: VesselsDataService,
    public paymentsDataService: PaymentsDataService,
    public sharedMethods: SharedmethodsService,
    public activatedRoute: ActivatedRoute,
    public analyticsService: AnalyticsService,
    public profileDataService: ProfilesDataService,
  ) {
    this.activatedRoute.queryParams.subscribe(async(params) => {
      if (params?.vessel) {
        this.vessel = JSON.parse(params.vessel);
        const users = await firstValueFrom(this.profileDataService.getAll());
        this.allUsers = users;

        this.paymentsDataService.getAll().subscribe(async(data) => {
          this.currentUser = await this.sharedMethods.readDataFromStorage(
            StorageKeys.userData
          );
          this.vesselPayments = data?.filter(
            (payment) =>
              payment.vesselId === this.vessel.onlineRef &&
              payment.createdBy === this.currentUser?.id
          );

          // Add user & vessel details to each payment
          this.vesselPayments = this.vesselPayments.map((payment) => {
            const user = this.allUsers.find(
              (u) => u.onlineRef === payment.userId
            );
            return {
              ...payment,
              user: user ?? null,
              vessel: this.vessel,
            };
          });

          // group vessel payments by date
          this.groupedVesselPayments = this.groupPaymentsByDate(
            this.vesselPayments
          );
        });
      }
    });
  }

  async ngOnInit() {
    this.commonText = await this.contentService?.commonText;
    this.currentLanguage = this.contentService?.currentLanguage;
    const paymentsPageData = this.contentService.getContentByPropertyName('payments-common-text');
    this.paymentsCommonText = this.sharedMethods.convertAdditionalTextToObj(paymentsPageData?.additionalText);
    this.pageTitle = this.paymentsCommonText?.vesselPayments;

    this.analyticsService.trackEvent(PageEventNames.viewVesselPayments, this.sharedMethods.analyticsEventParams);
  }

  groupPaymentsByDate(payments) {
    const grouped = payments.reduce((acc, payment) => {
      const date = new Date(payment.paymentDate).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(payment);
      return acc;
    }, {});

    const vesselPayments = Object.keys(grouped).map((date) => ({
      date: this.sharedMethods.formatLocalDate(date, this.currentLanguage),
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

  goToPaymentDetail(paymentDetails) {
    const queryParams = { paymentDetails: JSON.stringify(paymentDetails) };
    this.router.navigate(['payments/payment-details'], { queryParams });
  }
}
