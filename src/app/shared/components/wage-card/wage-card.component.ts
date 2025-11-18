import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { SharedmethodsService } from '../../services/sharedmethods/sharedmethods.service';
import { UserData, UserRole } from '../../types/api-types';

type WageStatus = 'action_required' | 'issue_pending' | 'received' | 'pending' | 'confirmed';

@Component({
  selector: 'app-wage-card',
  templateUrl: './wage-card.component.html',
  styleUrls: ['./wage-card.component.scss'],
  standalone: false
})
export class WageCardComponent  implements OnInit {
  
  commonText: any;
  paymentsCommonText: any;
  currentLanguage = 'en-us';
  currentUser: UserData;
  isWorker = false;
  isVesselOwner = false;

  @Input() status: WageStatus = 'action_required';
  @Input() amount;
  @Input() paymentDate: string;
  @Input() payee;

  @Output() onClick = new EventEmitter<any>();

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
  ) { }

  async ngOnInit() {
    this.commonText = await this.contentService?.commonText;
    const paymentsPageData = this.contentService.getContentByPropertyName('payments-common-text');
    this.paymentsCommonText = this.sharedMethods.convertAdditionalTextToObj(paymentsPageData?.additionalText);
    this.currentLanguage = this.contentService?.currentLanguage;
    this.currentUser = await this.sharedMethods.getUserData();
    this.isWorker = this.currentUser?.role === UserRole.worker;
    this.isVesselOwner = this.currentUser?.role === UserRole.vesselOwner;
  }

  onClickCard(e) {
    this.onClick.emit(e);
  }

  getStatusText() {
    switch (this.status) {
      case 'action_required':
        return this.paymentsCommonText?.actionRequired || 'Action required';
      case 'issue_pending':
        return this.paymentsCommonText?.issuePending || 'Issue pending';
      case 'received':
        return this.paymentsCommonText?.received || 'Received';
      case 'pending':
        return this.paymentsCommonText?.pending || 'Pending';
      case 'confirmed':
        return this.paymentsCommonText?.confirmed || 'Confirmed';
      default:
        return this.status;
    }
  }
}
