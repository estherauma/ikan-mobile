import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  commonText: any;
  payslipText = 'Payslip';
  payment: any;
  paymentBreakdowns: any = [
    {
      type: 'Cash',
      madeOn: '30/09/2022',
      confirmedOn: '30/09/2022',
      confirmed: false,
      status: '',
      amount: '$999.0',
    },
    {
      type: 'Beneficiary',
      madeOn: '30/09/2022',
      confirmedOn: '30/09/2022',
      confirmed: false,
      status: '',
      amount: '$999.0',
    },
    {
      type: 'Bank transfer',
      madeOn: '30/09/2022',
      confirmedOn: '',
      confirmed: false,
      status: '',
      amount: '$999.0',
    }
  ];

  constructor(
    public activatedRoute: ActivatedRoute,
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.payslipText = this.commonText?.payslip;
    this.activatedRoute.params.subscribe((data) => {
      if (data) {
        this.payment = data;
        this.generatePaymentBreakdown(data);
      }
    });

    // Testing
    if (this.contentService?.currentLanguage === 'qm-zh') {
      this.paymentBreakdowns[0].type = '現金';
      this.paymentBreakdowns[1].type = '受益人';
      this.paymentBreakdowns[2].type = '銀行轉帳';
    }
  }

  generatePaymentBreakdown(payment) {

  }

}
