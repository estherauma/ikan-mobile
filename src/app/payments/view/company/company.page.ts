import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {
  pageTitle = '';
  orgPayments = [
    {
      date: '10 Aug',
      payments: [
        {
          amount: '$XXX.XX',
          confirmedOn: 'xx/xx/xxxx',
          madeOn: 'xx/xx/xxxx',
          status: 'confirmed'
        },
        {
          amount: '$XXX.XX',
          confirmedOn: 'xx/xx/xxxx',
          madeOn: 'xx/xx/xxxx',
          status: 'confirmed'
        }
      ]
    },
    {
      date: '8 Aug',
      payments: [
        {
          amount: '$XXX.XX',
          confirmedOn: 'xx/xx/xxxx',
          madeOn: 'xx/xx/xxxx',
          status: 'confirmed'
        },
        {
          amount: '$XXX.XX',
          confirmedOn: 'xx/xx/xxxx',
          madeOn: 'xx/xx/xxxx',
          status: 'confirmed'
        }
      ]
    },
    {
      date: '31 Jul',
      payments: [
        {
          amount: '$XXX.XX',
          confirmedOn: 'xx/xx/xxxx',
          madeOn: 'xx/xx/xxxx',
          status: 'Awaiting Confirmation'
        },
        {
          amount: '$XXX.XX',
          confirmedOn: 'xx/xx/xxxx',
          madeOn: 'xx/xx/xxxx',
          status: 'Awaiting Confirmation'
        }
      ]
    }
  ];

  filterOptions = [
    {title:'closed', value:'closed'},
    {title:'opened', value:'opened'}
  ];

  filterDataSet = [];

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
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
}
