import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ContentService } from '../../services/content/content.service';

export type PaymentType = 'Bank transfer' | 'Beneficiary' | 'Cash' | 'Listing';
@Component({
  selector: 'app-paymentbreakdowncard',
  templateUrl: './paymentbreakdowncard.component.html',
  styleUrls: ['./paymentbreakdowncard.component.scss'],
})
export class PaymentbreakdowncardComponent implements OnInit {
  
  commonText: any;

  @Input() showStatus = true;
  @Input() statusClass: any; // add type
  @Input() status = '';
  @Input() showType = false;
  @Input() type: PaymentType = 'Listing'; //change type
  @Input() iconUrl = '';
  @Input() currency = '$';
  @Input() amount = '';
  @Input() paymentMadeOn: string = '';
  @Input() paymentConfirmedOn: string = '';
  @Input() showConfirmationPrompt = false;
  @Input() showGrievancePrompt = false;

  @Output() onClick = new EventEmitter<any>();
  @Output() confirmPayment = new EventEmitter<any>();
  @Output() raiseGrievance = new EventEmitter<any>();


  constructor(
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
  }

  onClickCard(e) {
    this.onClick.emit(e);
  }

  goToConfirmPayment() {
    this.confirmPayment.emit();
  }

  goToRaiseGrievance() {
    this.raiseGrievance.emit();
  }
}
