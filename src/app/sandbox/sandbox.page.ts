import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.page.html',
  styleUrls: ['./sandbox.page.scss'],
})
export class SandboxPage implements OnInit {
  paymentBreakdowns: any = [
    {
      type: 'Bank transfer',
      madeOn: '30/09/2022',
      confirmedOn: '',
      confirmed: true,
      status: 'confirmed',
      amount: '$999.0'
    },
    {
      type: 'Cash',
      madeOn: '30/09/2022',
      confirmedOn: '30/09/2022',
      confirmed: false,
      status: '',
      amount: '$999.0',
    },
    {
      type: 'Beneficiary',
      madeOn: '30/09/2022',
      confirmedOn: '30/09/2022',
      confirmed: false,
      status: '',
      amount: '$999.0',
    },
    {
      type: 'Bank transfer',
      madeOn: '30/09/2022',
      confirmedOn: '',
      confirmed: false,
      status: '',
      amount: '$999.0',
    }
  ];
  paymentListings: any = [
    {
      madeOn: '30/09/2022',
      confirmedOn: '',
      status: 'confirmed',
      amount: '$999.0'
    },
    {
      madeOn: '30/09/2022',
      confirmedOn: '30/09/2022',
      status: 'confirmed',
      amount: '$999.0',
    }
  ];
  constructor() { }
  ngOnInit() {
  }

}
