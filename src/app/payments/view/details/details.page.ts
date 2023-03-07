import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  payment: any;

  paymentBreakdowns: any = [
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

  constructor(
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((data) => {
      if (data) {
        this.payment = data;
        this.generatePaymentBreakdown(data);
      }
    });
  }

  generatePaymentBreakdown(payment) {

  }

}
