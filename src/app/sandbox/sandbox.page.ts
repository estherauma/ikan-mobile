import { Component, OnInit } from '@angular/core';
import { IPaymentsSummary } from '../shared/types/api-types';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.page.html',
  styleUrls: ['./sandbox.page.scss'],
})
export class SandboxPage implements OnInit {
  contracts = [
    {
      imgUrl: 'assets/imgs/vessel.jpeg',
      title: 'Budi Surname',
      contract: 'Taien Company',
      vessel: 'Vessel Name',
      dates: 'XX/XX/XXXX',
      isLight: false,
    },
    {
      imgUrl: 'assets/imgs/vessel.jpeg',
      title: 'Budi Surname',
      contract: 'Taien Company',
      vessel: 'Vessel Name',
      dates: 'XX/XX/XXXX',
      isLight: true,
    }
  ];
  payments: IPaymentsSummary[] = [
    {
      amount: '$123.9',
      text: 'Name of company paying in',
      status: 'failed',
    },
    {
      amount: '$123.9',
      text: 'Name of company paying in',
      status: 'warning',
    },
    {
      amount: '$123.9',
      text: 'Name of company paying in',
      status: 'success',
    },
    {
      amount: '$123.9',
      text: 'Name of company paying in',
      status: 'default',
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
