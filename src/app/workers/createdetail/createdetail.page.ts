import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { WorkersDataService } from '../data/workers-data.service';

@Component({
  selector: 'app-create',
  templateUrl: './createdetail.page.html',
  styleUrls: ['./createdetail.page.scss'],
})
export class CreateDetailPage extends BaseformPage implements OnInit {
  submitButtonText='Save&Close';
  createWorkerFormGroup;
  prevQuestions;
  prevData;


  constructor(
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public sharedMethods: SharedmethodsService,
    public workerDataService: WorkersDataService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
  ) {
    super(contentService);
   }

  async ngOnInit() {
    super.ngOnInit();
    await this.getPageParams();
    const pageData = this.contentService.getContentByPropertyName('createworkers');
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions = this.prevQuestions.concat(pageData?.formQuestions);
    this.formQuestions.forEach((entry) => {
      if (entry.key in this.prevData) {
        this.group[entry.key] = new FormControl(this.prevData[entry.key], [Validators.required]);
      } else {
        this.group[entry.key] = new FormControl('', []);
      }

    });

    this.pageFormGroup = new FormGroup(this.group);
  }

  async getPageParams() {
    this.activatedRoute.params.subscribe((params) => {
      const { data, questions } = params;
      this.prevQuestions = JSON.parse(questions);
      this.prevData = JSON.parse(data);
    });
  }

  async onSubmit(formData) {
    this.sharedMethods.showLoader(this.contentService.commonText?.saving);
    const now = this.sharedMethods.getCurrentDateTime();
    formData.created_at = formData.updated_at = now;
    const userData = await this.sharedMethods.getUserData();
    formData.created_by = formData.updated_by = userData?.id;
    const insertId = await this.workerDataService.create(formData);
    this.modalCtrl.dismiss();
    if (insertId) {
      this.modalCtrl.dismiss();
      this.router.navigate(['workers/home', formData]);
      // show invite success alert
      // Commented out because it is not implemented yet
      // await this.showInviteSentAlert(formData);
    } else {
      this.sharedMethods.showLoader(this.contentService.commonText?.error);
    }
  }

  async showInviteSentAlert(formData) {
    // TODO: Add message to prismic
    const message = `A new invitation has been sent to ${formData.f_name} ${formData.l_name} to join IKAN. \
      Once they have accepted, you will see them in the workers' area of the app`;
    const alert = await this.alertCtrl.create({
      cssClass: 'tuna-alert invite-success-alert',
      header: this.contentService.commonText?.inviteSent || 'Invite Sent',
      message,
      buttons: [
        {
          text: this.contentService.commonText?.ok,
          handler: () => {
            this.modalCtrl.dismiss();
            this.router.navigate(['workers/home', formData]);
          }
        }
      ]
    });
    await alert.present();
  }
}
