import { Component, Input, OnInit } from '@angular/core';

export type PaymentType = 'Bank transfer' | 'Beneficiary' | 'Cash' | 'Listing';
@Component({
  selector: 'app-paymentbreakdowncard',
  templateUrl: './paymentbreakdowncard.component.html',
  styleUrls: ['./paymentbreakdowncard.component.scss'],
})
export class PaymentbreakdowncardComponent implements OnInit {
  @Input() type: PaymentType = 'Listing';
  @Input() isListing = false;
  @Input() amount = '';
  @Input() madeOn = '';
  @Input() confirmedOn = '';
  @Input() isConfirmable = false;
  @Input() status = '';
  iconUrl;
  constructor() { }

  ngOnInit() {
    if (this.type === 'Listing') {
      this.isListing = true;
      this.iconUrl = '/assets/icon/single_payment.svg';
    }

    if (this.type === 'Bank transfer') {
      this.iconUrl = '/assets/icon/bank.svg';
    }

    if (this.type === 'Beneficiary') {
      this.iconUrl = '/assets/icon/beneficiary.svg';
    }

    if (this.type === 'Cash') {
      this.iconUrl = '/assets/icon/cash.svg';
    }
  }

}
