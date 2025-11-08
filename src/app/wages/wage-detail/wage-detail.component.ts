import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';
import { ModalController } from '@ionic/angular';
import { ViewImageComponent } from 'src/app/mydocuments/view-image/view-image.component';


@Component({
  selector: 'app-wage-detail',
  templateUrl: './wage-detail.component.html',
  styleUrls: ['./wage-detail.component.scss'],
  standalone: false,
})
export class WageDetailComponent  implements OnInit {

  commonText: any;
  paymentsCommonText: any;
  wageDetails: any;
  currentLanguage = 'en-us';
  currentUser: any;
  hasInternet = false;
  payslipPdfUrl: string;
  showSpinner = true;


  constructor(
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
    public sharedMethods: SharedmethodsService,
    public analyticsService: AnalyticsService,
    public modalController: ModalController,
  ) {
    this.activatedRoute.queryParams.subscribe(async(params) => {
      if (params?.wageDetails) {
        this.wageDetails = JSON.parse(params.wageDetails);
      }
    });
  }

  async ngOnInit() {
    this.commonText = this.contentService?.commonText;
    const paymentsPageData = this.contentService.getContentByPropertyName('payments-common-text');
    this.paymentsCommonText = this.sharedMethods.convertAdditionalTextToObj(paymentsPageData?.additionalText);
    this.currentLanguage = this.contentService?.currentLanguage;
    this.currentUser = await this.sharedMethods.getUserData();
    
    const analyticsEventParams = this.sharedMethods.getAnalyticsEventParams();
    this.analyticsService.trackEvent(PageEventNames.viewWageDetails, analyticsEventParams);
  }

  async viewPdf(file) {
    if (this.sharedMethods.currentPlatform === 'web') {
      window.open(file, '_blank');
    } else {
      await FileOpener.openFile({ path: file, mimeType: 'application/pdf' })
        .catch((e) => {
          console.log('Error opening file', e);
          // TODO: translate
          this.sharedMethods.showToast(this.paymentsCommonText?.errorOpeningFile || 'Error opening file');
        });
    }
  }

  async viewImage(file) {
    // TODO: translate
    const imageFile = {
      fileUrl: file,
      // fileName: file
    };
    const modal = await this.modalController.create({
      cssClass: 'ikan-modal wage-image-modal',
      component: ViewImageComponent,
      componentProps: {
        imageFile,
        customImageViewClass: 'wage-image-view-wrapper',
      },
    });
    await modal.present();
  }
}
