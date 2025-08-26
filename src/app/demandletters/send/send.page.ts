import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DemandLetter } from '../home/home.page';

@Component({
    selector: 'app-send',
    templateUrl: './send.page.html',
    styleUrls: ['./send.page.scss'],
    standalone: false
})
export class SendPage implements OnInit {
  pageTitle='Send Demand Letter';
  demandLetter: DemandLetter;
  selectedRecipient: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.pageTitle = params.name;
      this.demandLetter = params as DemandLetter;
    });
  }

  viewDeatils(demantLetter: DemandLetter) {
    this.router.navigate(['/demandletters/view', demantLetter]);
  }

  onRecipientSelect(e) {
    this.selectedRecipient = e.detail.value;
  }

  async onSendDemandLetter() {
    const successAlert = await this.alertController.create({
      header: 'Success Message',
      backdropDismiss: true,
      message:`Your Demand Letter has been sent to ${this.selectedRecipient}`,
      buttons:[
        {
          text: 'ok',
          role: 'confirm',
          handler: async() => {
            await successAlert.dismiss();
            this.router.navigate(['/demandletters/home']);
          }
        }
      ]
    });

    await successAlert.present();
  }

}
