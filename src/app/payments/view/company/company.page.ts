import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { PaymentsDataService } from '../../data/payments-data.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {
  pageTitle = '';
  orgPayments = [];

  filterOptions = [
    {title:'closed', value:'closed'},
    {title:'opened', value:'opened'}
  ];

  filterDataSet = [];

  constructor(
    public router: Router,
    public paymentDataService: PaymentsDataService,
    public sharedMethods: SharedmethodsService
  ) {
    this.paymentDataService.getAll().subscribe((data) => {
      this.organizeData(data);
    });
  }

  ngOnInit() {
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
    this.orgPayments?.sort((a, b) => (a.date < b.date) ? 1 : -1);
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
