import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { PaymentsDataService } from '../../data/payments-data.service';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {
  commonText: any;
  companyData: any;
  pageTitle = '';
  orgPayments = [];

  filterOptions = [
    {title:'closed', value:'closed'},
    {title:'opened', value:'opened'}
  ];

  filterDataSet = [];

  // for test purposes
  testPayments = [
    {
      id: 1,
      companyName: 'Vessel Company One',
      type: 'Salary',
      worker: 1,
      totalAmount: 3000,
      remmitanceAmount: 400,
      beneficiaryAmount: 1000,
      cashAmount: 1600,
      date: new Date(),
      // status: data.rows.item(i).status,
      // confirmed: data.rows.item(i).confirmed,
      // confirmedDate: data.rows.item(i).confirmed_date,
      // onlineRef: data.rows.item(i).online_ref,
      // createdAt: data.rows.item(i).created_at,
      // updatedAt: data.rows.item(i).updated_at,
      // createdBy: data.rows.item(i).created_by,
      // updatedBy: data.rows.item(i).updated_by,
    },
    {
      id: 1,
      companyName: 'Vessel Company Two',
      type: 'Bonus',
      worker: 1,
      totalAmount: 3000,
      remmitanceAmount: 400,
      beneficiaryAmount: 1000,
      cashAmount: 1600,
      date: new Date(),
      // status: data.rows.item(i).status,
      // confirmed: data.rows.item(i).confirmed,
      // confirmedDate: data.rows.item(i).confirmed_date,
      // onlineRef: data.rows.item(i).online_ref,
      // createdAt: data.rows.item(i).created_at,
      // updatedAt: data.rows.item(i).updated_at,
      // createdBy: data.rows.item(i).created_by,
      // updatedBy: data.rows.item(i).updated_by,
    }
  ];

  constructor(
    public router: Router,
    public paymentDataService: PaymentsDataService,
    public sharedMethods: SharedmethodsService,
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
  ) {
    this.paymentDataService.getAll().subscribe((data) => {
      data.push(...this.testPayments); // for test purposes
      this.organizeData(data);
    });
    this.activatedRoute.params.subscribe((params) => {
      if (params) {
        this.companyData = params;
      }
    });
  }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.filterOptions = [
      {title: this.commonText?.closed, value: 'closed'},
      {title: this.commonText?.opened, value: 'opened'}
    ];
  }

  organizeData(data) {
    data.forEach((payment) => {
      const weekday = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const [year, month, dayNumber] = (new Date(payment.date)).toISOString().substr(0, 10).split('-');
      const day = (new Date(payment.date)).getDay();
      const dayString = weekday[day];
      const dateString = `${dayString}-${dayNumber}-${month}-${year}`;
      const entryExists = this.orgPayments.find((e) => e.date === dateString);
      if (!entryExists) {
        this.orgPayments.push({
          date: dateString,
          payments: [payment]
        });
      } else {
        entryExists.payments.push(payment);
      }
    });
    this.orgPayments.sort((a, b) => (a.date < b.date) ? 1 : -1);
  }

  searchResult(result) {
  }

  viewDetails(payment) {
    this.router.navigate(['payments/view/details', payment]);
  }

  newPayment() {
    this.router.navigate(['payments/create']);
  }

  filterResult(value) {}

  createPayment() {
    this.router.navigate(['payments/create']);
  }
}
