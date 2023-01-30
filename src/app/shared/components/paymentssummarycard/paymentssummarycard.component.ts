import { Component, Input, OnInit } from '@angular/core';
import { TPaymentStatus } from '../../types/api-types';


@Component({
  selector: 'app-paymentssummarycard',
  templateUrl: './paymentssummarycard.component.html',
  styleUrls: ['./paymentssummarycard.component.scss'],
})
export class PaymentssummarycardComponent implements OnInit {
  @Input() iconUrl;
  @Input() status: TPaymentStatus = 'default';
  @Input() title;
  @Input() text;

  iconLink = '/assets/icon';
  constructor() { }

  ngOnInit() {
    if (this.iconUrl) {return;}
    if (this.status === 'warning') {
      this.iconUrl = `${this.iconLink}/good_yellow.svg`;
    } else if (this.status === 'success') {
      this.iconUrl = `${this.iconLink}/good_green.svg`;
    } else if (this.status === 'failed') {
      this.iconUrl = `${this.iconLink}/bad_red.svg`;
    } else {
      this.iconUrl = `${this.iconLink}/good_gray.svg`;
    }
  }

}
