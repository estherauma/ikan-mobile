import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { UserData } from 'src/app/shared/types/api-types';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.page.html',
  styleUrls: ['./payment-details.page.scss'],
})
export class PaymentDetailsPage  implements OnInit {

  commonText: any;
  paymentsCommonText: any;
  paymentDetails: any;
  paymentIconUrl = 'assets/icon/gray_thumbs_up.svg';
  currentUser: UserData;
  currentLanguage = 'en-us';

  constructor(
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
    public sharedmethods: SharedmethodsService,
    public analyticsService: AnalyticsService,
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params?.paymentDetails) {
        this.paymentDetails = JSON.parse(params.paymentDetails);
        this.paymentDetails.deductions = this.paymentDetails.deductions ? JSON.parse(this.paymentDetails.deductions) : null;
        this.paymentIconUrl = this.getPaymentIconUrlByStatus(this.paymentDetails.status);
      }
    });
  }

  async ngOnInit() {
    this.commonText = this.contentService?.commonText;
    const paymentsPageData = this.contentService.getContentByPropertyName('payments-common-text');
    this.paymentsCommonText = this.sharedmethods.convertAdditionalTextToObj(paymentsPageData?.additionalText);
    this.currentLanguage = this.contentService?.currentLanguage;
    this.currentUser = await this.sharedmethods.getUserData();

    this.analyticsService.trackEvent(PageEventNames.viewPaymentDetails, this.sharedmethods.analyticsEventParams);
  }

  // TODO: change statuses
  getPaymentIconUrlByStatus(status: string) {
    let iconUrl = 'assets/icon/gray_thumbs_up.svg';
    if (status === 'Pending') {
      iconUrl = 'assets/icon/orange_thumbs_up.svg';
    } else if (status === 'Confirmed') {
      iconUrl = 'assets/icon/green_thumbs_up.svg';
    } else if (status === 'Rejected') {
      iconUrl = 'assets/icon/red_thumbs_down.svg';
    }
    return iconUrl;
  }

  getPaymentMethodLabel(paymentMethod: string): string {
    if (paymentMethod === 'bank_transfer') {
      return this.paymentsCommonText?.bankTransfer || 'Bank Transfer';
    } else if (paymentMethod === 'cash') {
      return this.paymentsCommonText?.cash || 'Cash';
    } else if (paymentMethod === 'both') {
      return this.paymentsCommonText?.cashAndBankTransfer || 'Cash and Bank Transfer';
    }
    return this.paymentsCommonText?.[paymentMethod] || paymentMethod;
  }

  getLabel(key: string): string {
    return this.paymentsCommonText?.[key] || key;
  }
}
