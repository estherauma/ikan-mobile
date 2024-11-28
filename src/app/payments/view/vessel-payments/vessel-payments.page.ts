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
      this.vesselPayments = data?.filter(
        (payment) => payment.createdBy === this.currentUser.id
      );
      // dummy data
      // TODO: reove dummy data after adding payments
      this.vesselPayments = this.vesselPayments?.length
        ? this.vesselPayments
        : [
            {
              id: 1,
              companyName: 'Company Name 1',
              type: 'Cash',
              worker: '-Nj748NSgdNa6i4-_l_N',
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
              worker: '-Nj748NSgdNa6i4-_l_N',
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
            {
              id: 1,
              companyName: 'Company Name 3',
              type: 'Cash',
              worker: '-Nj748NSgdNa6i4-_l_N',
              totalAmount: 600,
              remmitanceAmount: 0,
              beneficiaryAmount: 300,
              cashAmount: 300,
              date: '2024-11-01T10:00:00Z',
              status: 'Pending',
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
              companyName: 'Company Name 4',
              type: 'Cash',
              worker: '-Nj748NSgdNa6i4-_l_N',
              totalAmount: 600,
              remmitanceAmount: 0,
              beneficiaryAmount: 300,
              cashAmount: 300,
              date: '2024-11-02T10:00:00Z',
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
              companyName: 'Company Name 4',
              type: 'Cash',
              worker: '-Nj748NSgdNa6i4-_l_N',
              totalAmount: 600,
              remmitanceAmount: 0,
              beneficiaryAmount: 300,
              cashAmount: 300,
              date: '2024-11-02T10:00:00Z',
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
            {
              id: 1,
              companyName: 'Company Name 6',
              type: 'Cash',
              worker: '-Nj748NSgdNa6i4-_l_N',
              totalAmount: 600,
              remmitanceAmount: 0,
              beneficiaryAmount: 300,
              cashAmount: 300,
              date: '2024-01-01T10:00:00Z',
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
            {
              id: 1,
              companyName: 'Company Name 7',
              type: 'Bank Transfer',
              worker: '-Nj748NSgdNa6i4-_l_N',
              totalAmount: 600,
              remmitanceAmount: 0,
              beneficiaryAmount: 300,
              cashAmount: 300,
              date: '2024-01-01T10:00:00Z',
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
          ];
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

  goToPaymentDetail(paymentDetails) {
    const queryParams = { paymentDetails: JSON.stringify(paymentDetails) };
    this.router.navigate(['payments/payment-details'], { queryParams });
  }
}
