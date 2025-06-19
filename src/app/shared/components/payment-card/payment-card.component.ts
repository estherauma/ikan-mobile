import { Component,  OnInit } from '@angular/core';

export type PaymentType = 'Bank transfer' | 'Beneficiary' | 'Cash' | 'Listing';
@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss'],
})
export class PaymentCardComponent  implements OnInit {
  
  constructor() { }

  ngOnInit() {}

}
