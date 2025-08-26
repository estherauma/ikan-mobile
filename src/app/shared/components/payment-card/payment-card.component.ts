import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { SharedmethodsService } from '../../services/sharedmethods/sharedmethods.service';
import { UserData } from '../../types/api-types';

export type PaymentType = 'Bank transfer' | 'Beneficiary' | 'Cash' | 'Listing';
@Component({
    selector: 'app-payment-card',
    templateUrl: './payment-card.component.html',
    styleUrls: ['./payment-card.component.scss'],
    standalone: false
})
export class PaymentCardComponent  implements OnInit {

  commonText: any;
  paymentsCommonText: any;
  currentUser: UserData;
  currentLanguage = 'en-us';

  @Input() showStatus = false;
  @Input() statusClass: any; // add type
  @Input() status = '';
  @Input() showType = false;
  @Input() type = '';
  @Input() iconUrl = '';
  @Input() currency = '$';
  @Input() amount = '';
  @Input() paymentDate = '';
  @Input() payee = '';
  @Input() confirmationDate = '';
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
    const paymentsPageData = this.contentService.getContentByPropertyName('payments-common-text');
    this.paymentsCommonText = this.sharedmethods.convertAdditionalTextToObj(paymentsPageData?.additionalText);
    this.currentLanguage = this.contentService?.currentLanguage;
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
