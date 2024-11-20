import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.page.html',
  styleUrls: ['./payment-details.page.scss'],
})
export class PaymentDetailsPage  implements OnInit {

  commonText: any;
  paymentDetails: any;
  paymentIconUrl: string = 'assets/icon/gray_thumbs_up.svg';

  constructor(
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params?.paymentDetails) {
        this.paymentDetails = JSON.parse(params.paymentDetails);
        this.paymentIconUrl = this.getPaymentIconUrlByStatus(this.paymentDetails.status);
      }
    });
  }

  async ngOnInit() {
    this.commonText = this.contentService?.commonText;
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
}
