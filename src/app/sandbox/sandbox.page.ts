import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { BaseformPage } from '../shared/components/baseform/baseform.page';
import { ContentService } from '../shared/services/content/content.service';
import { IPaymentsSummary } from '../shared/types/api-types';
import { SharedmethodsService } from '../shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.page.html',
  styleUrls: ['./sandbox.page.scss'],
})
export class SandboxPage extends BaseformPage implements OnInit {
  paymentBreakdowns: any = [
    {
      type: 'Bank transfer',
      madeOn: '30/09/2022',
      confirmedOn: '',
      confirmed: true,
      status: 'confirmed',
      amount: '$999.0'
    },
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
  paymentListings: any = [
    {
      madeOn: '30/09/2022',
      confirmedOn: '',
      status: 'confirmed',
      amount: '$999.0'
    },
    {
      madeOn: '30/09/2022',
      confirmedOn: '30/09/2022',
      status: 'confirmed',
      amount: '$999.0',
    }];
  payments: IPaymentsSummary[] = [
    {
      amount: '$123.9',
      text: 'Name of company paying in',
      status: 'failed',
    },
    {
      amount: '$123.9',
      text: 'Name of company paying in',
      status: 'warning',
    },
    {
      amount: '$123.9',
      text: 'Name of company paying in',
      status: 'success',
    },
    {
      amount: '$123.9',
      text: 'Name of company paying in',
      status: 'default',
    }
  ];

  contracts = [
    {
      imgUrl: 'assets/imgs/vessel.jpeg',
      title: 'Budi Surname',
      contract: 'Taien Company',
      vessel: 'Vessel Name',
      dates: 'XX/XX/XXXX',
      isLight: false,
    },
    {
      imgUrl: 'assets/imgs/vessel.jpeg',
      title: 'Budi Surname',
      contract: 'Taien Company',
      vessel: 'Vessel Name',
      dates: 'XX/XX/XXXX',
      isLight: true,
    }
  ];

  audioSrc = 'http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3';

  customSubmitBtnDisabled = true;
  formData;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
  ) {
    super(contentService);
    const pageData = this.contentService.getContentByPropertyName('createworkerprofile');
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      const validators = this.sharedMethods.getFormValidators(entry);
      this.group[entry.key] = new FormControl('', validators);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }
  ngOnInit() {
  }

  dataFromCustomButton(event) {
    this.customSubmitBtnDisabled = !event.valid;
    this.formData = event.data;
  }

  customSubmit() {
    alert(JSON.stringify(this.formData));
  }

}
