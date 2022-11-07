import { Component, OnInit } from '@angular/core';

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
          title: '$XXX.XX',
          subtitle: 'xx/xx/xxxx',
          status: 'Awaiting Confirmation'
        },
        {
          title: '$XXX.XX',
          subtitle: 'xx/xx/xxxx',
          status: 'Awaiting Confirmation'
        }
      ]
    },
    {
      date: '8 Aug',
      payments: [
        {
          title: '$XXX.XX',
          subtitle: 'xx/xx/xxxx',
          status: 'Awaiting Confirmation'
        },
        {
          title: '$XXX.XX',
          subtitle: 'xx/xx/xxxx',
          status: 'Awaiting Confirmation'
        }
      ]
    },
    {
      date: '31 Jul',
      payments: [
        {
          title: '$XXX.XX',
          subtitle: 'xx/xx/xxxx',
          status: 'Awaiting Confirmation'
        },
        {
          title: '$XXX.XX',
          subtitle: 'xx/xx/xxxx',
          status: 'Awaiting Confirmation'
        }
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  searchResult(result) {
  }

  viewDetails(payment){
    console.log(payment);
  }
}
