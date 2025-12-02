import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { AppEventNames, PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-wage-tracking-help',
  templateUrl: './wage-tracking-help.component.html',
  styleUrls: ['./wage-tracking-help.component.scss'],
  standalone: false,
})
export class WageTrackingHelpComponent  implements OnInit {

  commonText: any;
  paymentsCommonText: any;
  wagesChapter = '3'; // This is from the learning hub content
  wagesSubchapterID = '3.5'; // This is from the learning hub content
  detailsClause: any; // clause to show employer details
  
  constructor(
    public contentService: ContentService,
    public router: Router,
    public alertController: AlertController,
    public activatedRoute: ActivatedRoute,
    public sharedMethods: SharedmethodsService,
    public analyticsService: AnalyticsService,
  ) {
    this.activatedRoute.queryParams.subscribe(async(params) => {
      if (params?.contractData) {
        const data = JSON.parse(params.contractData);
        if (Object.keys(data).length > 0 && data?.detailsClause) {
          this.detailsClause = data.detailsClause;
        }
      }
    });
  }

  async ngOnInit() {
    this.commonText = this.contentService?.commonText;
    const paymentsPageData = this.contentService.getContentByPropertyName('payments-common-text');
    this.paymentsCommonText = this.sharedMethods.convertAdditionalTextToObj(paymentsPageData?.additionalText);

    const analyticsEventParams = await this.sharedMethods.getAnalyticsEventParams();
    await this.analyticsService.trackEvent(PageEventNames.viewWageTrackingHelp, analyticsEventParams);
  }

  async onSkip() {
    const analyticsEventParams = await this.sharedMethods.getAnalyticsEventParams();
    await this.analyticsService.trackEvent(AppEventNames.skippedWageTrackingHelp, analyticsEventParams);
    
    this.router.navigate(['wages'], { replaceUrl: true });
  }

  async goToHelp() {
    const analyticsEventParams = await this.sharedMethods.getAnalyticsEventParams();
    await this.analyticsService.trackEvent(AppEventNames.viewTradeUnionNGOsGovernmentDetails, analyticsEventParams);
    
    this.router.navigate(['help'], { replaceUrl: true });
  }

  async goToLearningHubWages() {
    const analyticsEventParams = await this.sharedMethods.getAnalyticsEventParams();
    await this.analyticsService.trackEvent(AppEventNames.readFAQOnWages, analyticsEventParams);

    this.router.navigate(['learninghub/chapters', this.wagesChapter, this.wagesSubchapterID], { replaceUrl: true });
  }

  async goToContractDetails() {
    if (this.detailsClause) {
      const analyticsEventParams = await this.sharedMethods.getAnalyticsEventParams();
      await this.analyticsService.trackEvent(AppEventNames.viewMyEmployerDetails, analyticsEventParams);
      
      this.router.navigate(['/contracts/clauses/viewclause/', this.detailsClause]);
    } else {
      this.sharedMethods.showToast(this.paymentsCommonText?.contractMissingDetailsToast, 'long');
    }
  }

  async showAgentDetails() {
    const alert = await this.alertController.create({
      cssClass: 'tuna-alert wages-agent-details-alert',
      header: this.commonText?.comingSoon + '!',
      message: this.paymentsCommonText?.agentDetailsComingSoonMessage,
      buttons: [
        {
          text: this.commonText?.ok,
          handler: () => {
            this.router.navigate(['wages'], { replaceUrl: true });
          }
        },
      ],
    });

    await alert.present();

    const analyticsEventParams = await this.sharedMethods.getAnalyticsEventParams();
    await this.analyticsService.trackEvent(AppEventNames.viewMyManningAgentDetails, analyticsEventParams);
  }
}
