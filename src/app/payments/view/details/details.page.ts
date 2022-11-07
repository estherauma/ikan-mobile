import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  payment: any;

  breakDown = [
    {
      type: 'Bank Transfer:',
      amount: '£ XXX.XX',
      date: 'Date: xx/xx/xxxx',
      status: 'Confirmed'
    },
    {
      type: 'Cash:',
      amount: '£ XXX.XX',
      date: 'Date: xx/xx/xxxx',
      status: 'Confirmed'
    },
    {
      type: 'Beneficiery:',
      amount: '£ XXX.XX',
      date: 'Date: xx/xx/xxxx',
      status: 'Confirmed'
    }
  ];

  constructor(
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((data) => {
      if (data) {
        this.payment = data;
      }
    });
  }

}
