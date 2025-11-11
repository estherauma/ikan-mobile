import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-wage-tracking-help',
  templateUrl: './wage-tracking-help.component.html',
  styleUrls: ['./wage-tracking-help.component.scss'],
  standalone: false,
})
export class WageTrackingHelpComponent  implements OnInit {

  commonText: any;
  wagesChapter = '3'; // This is from the learning hub content
  wagesSubchapterID = '3.5'; // This is from the learning hub content
  
  constructor(
    public contentService: ContentService,
    public router: Router,
    public alertController: AlertController,
  ) { }

  async ngOnInit() {
    this.commonText = this.contentService?.commonText;
    console.log('commonText', this.commonText);
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

  // TODO: add logic
  goToContractDetails() {
    // const data = {};
    // const data = {
    //   ...this.clause,
    //   partyB: this.partyB,
    //   contractId: this.contract.id,
    //   contractOnlineRef: this.contract.onlineRef,
    // };
    // this.router.navigate(['/contracts/clauses/viewclause/', data]);
  }

  async showAgentDetails() {
    const alert = await this.alertController.create({
      cssClass: 'tuna-alert wages-agent-details-alert',
      header: this.commonText?.comingSoon + '!' || 'Coming Soon!',
      message: this.commonText?.agentDetailsComingSoonMessage || "Coming Soon! For now, if possible, please ask your captain or employer for your manning agent's contact.",
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
