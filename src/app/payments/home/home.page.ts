import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { VesselsDataService } from 'src/app/vessels/data/vessels-data.service';
import { PaymentsDataService } from '../data/payments-data.service';
import { StorageKeys, UserData } from 'src/app/shared/types/api-types';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  commonText: any;
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
  chineseFilterDataSet = [
    {
      name: '船隻公司',
      status: 'Opened',
    },
    {
      name: '船隻公司第二',
      status: 'Closed',
    },
    {
      name: '船隻公司三',
      status: 'Opened',
    },
    {
      name: '船隻公司四',
      status: 'Closed',
    },
  ];
  vesselCompanyText = 'Details about this vessel company';
  chineseVesselCompanyText = '有關該船隻公司的詳細信息';

  // translate
  pageTitle = 'Payments';
  organizations = [...this.filterDataSet];

  filterOptions = [
    { title: 'closed', value: 'closed' },
    { title: 'opened', value: 'opened' },
  ];
  unFilteredData = [];
  vessels = [];
  currentUser: UserData;
  userPayments = [];

  // remove after fixing filtering
  // TODO: fix filtering

  constructor(
    public router: Router,
    public contentService: ContentService,
    public vesselsDataService: VesselsDataService,
    public paymentsDataService: PaymentsDataService,
    public sharedMethods: SharedmethodsService
  ) {
    this.vesselsDataService.getAll().subscribe((data) => {
      this.vessels = this.unFilteredData = data;
    });
    this.paymentsDataService.getAll().subscribe(async (data) => {
      const user: UserData = await this.sharedMethods.readDataFromStorage(
        StorageKeys.userData
      );
      this.userPayments = data?.filter(
        (payment) => payment.WorkerId === user.id
      );
      // dummy data
      // TODO: reove dummy data after adding payments
      this.currentUser = await this.sharedMethods.readDataFromStorage(
        StorageKeys.userData
      );
      this.userPayments = this.userPayments?.length
        ? this.userPayments
        : [
            {
              id: 1,
              companyName: 'Company Name 1',
              type: 'Cash',
              worker: this.currentUser?.id,
              totalAmount: 600,
              remmitanceAmount: 0,
              beneficiaryAmount: 300,
              cashAmount: 300,
              date: '2024-11-01T10:00:00Z',
              status: 'Confirmed',
              confirmed: true,
              confirmedDate: '2024-11-01T10:00:00Z',
              fileUrl: null,
              onlineRef: 'ref',
              createdAt: '2024-11-01T10:00:00Z',
              updatedAt: '2024-11-01T10:00:00Z',
              createdBy: this.currentUser.id,
              updatedBy: this.currentUser.id,
            },
            {
              id: 1,
              companyName: 'Company Name 2',
              type: 'Cash',
              worker: this.currentUser?.id,
              totalAmount: 600,
              remmitanceAmount: 0,
              beneficiaryAmount: 300,
              cashAmount: 300,
              date: '2024-11-01T10:00:00Z',
              status: 'Rejected',
              confirmed: true,
              confirmedDate: '2024-11-01T10:00:00Z',
              fileUrl: null,
              onlineRef: 'ref',
              createdAt: '2024-11-01T10:00:00Z',
              updatedAt: '2024-11-01T10:00:00Z',
              createdBy: this.currentUser.id,
              updatedBy: this.currentUser.id,
            },
          ];
      console.log('userPayments', this.userPayments);
    });
  }

  async ngOnInit() {
    this.currentUser = await this.sharedMethods.readDataFromStorage(
      StorageKeys.userData
    );
    this.commonText = await this.contentService?.commonText;
    this.pageTitle = this.commonText?.payments;
    this.filterOptions = [
      { title: this.commonText?.closed, value: 'closed' },
      { title: this.commonText?.opened, value: 'opened' },
    ];

    // For testing purposes
    if (this.contentService?.currentLanguage === 'qm-zh') {
      this.organizations = [...this.chineseFilterDataSet];
      this.vesselCompanyText = this.chineseVesselCompanyText;
    }
  }

  searchResult(data) {
    this.organizations = data;
  }

  filterResult(result) {
    this.organizations = result;
  }

  goToVesselPayments(vessel) {
    const queryParams = { vessel: JSON.stringify(vessel) };
    this.router.navigate(['payments/vessel-payments'], { queryParams });
  }

  goToPaymentDetail(paymentDetails) {
    const queryParams = { paymentDetails: JSON.stringify(paymentDetails) };
    this.router.navigate(['payments/payment-details'], { queryParams });
  }
}
