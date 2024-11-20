import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { SharedmethodsService } from '../../services/sharedmethods/sharedmethods.service';
import { UserData } from '../../types/api-types';

export type PaymentType = 'Bank transfer' | 'Beneficiary' | 'Cash' | 'Listing';
@Component({
  selector: 'app-paymentbreakdowncard',
  templateUrl: './paymentbreakdowncard.component.html',
  styleUrls: ['./paymentbreakdowncard.component.scss'],
})
export class PaymentbreakdowncardComponent implements OnInit {
  
  commonText: any;
  currentUser: UserData;

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
    public sharedmethods: SharedmethodsService,
  ) { }

  async ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.currentUser = await this.sharedmethods.getUserData();
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
