import { Component, Input, OnInit } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { SharedmethodsService } from '../../services/sharedmethods/sharedmethods.service';

type WageStatus = 'action_required' | 'issue_pending' | 'confirmed' | 'received';

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

  @Input() status: WageStatus = 'action_required';
  @Input() amount;
  @Input() paymentDate: string;
  @Input() payee;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
  ) { }

  async ngOnInit() {
    this.commonText = await this.contentService?.commonText;
    const paymentsPageData = this.contentService.getContentByPropertyName('payments-common-text');
    this.paymentsCommonText = this.sharedMethods.convertAdditionalTextToObj(paymentsPageData?.additionalText);
    this.currentLanguage = this.contentService?.currentLanguage;
  }

}
