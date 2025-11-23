import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
  }

  onSkip() {
    this.router.navigate(['wages'], { replaceUrl: true });
  }

  goToHelp() {
    this.router.navigate(['help'], { replaceUrl: true });
  }

  goToLearningHubWages() {
    this.router.navigate(['learninghub/chapters', this.wagesChapter, this.wagesSubchapterID], { replaceUrl: true });
  }

  goToContractDetails() {
    if (this.detailsClause) {
      this.router.navigate(['/contracts/clauses/viewclause/', this.detailsClause]);
    } else {
      this.sharedMethods.showToast(this.paymentsCommonText?.contractMissingDetailsToast, 'long');
    }
  }

  async showAgentDetails() {
    const alert = await this.alertController.create({
      cssClass: 'tuna-alert wages-agent-details-alert',
      header: this.commonText?.comingSoon + '!',
      message: this.commonText?.agentDetailsComingSoonMessage,
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
  }
}
