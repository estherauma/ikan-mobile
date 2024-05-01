import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { PaymentsDataService } from '../data/payments-data.service';
import { DeductionsPage } from './deductions/deductions.page';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage extends BaseformPage implements OnInit  {
  pageTitle = '';
  submitButtonText = 'Record payment';
  commonText: any;

  constructor(
    public contentServ: ContentService,
    public modalCtrl: ModalController,
    public sharedMethods: SharedmethodsService,
    public paymentDataService: PaymentsDataService,
    public router: Router
  ) {
    super(contentServ);
    const pageData = this.contentServ.getContentByPropertyName('payment-create');
    this.pageTitle  = pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach(entry => {
      const validators = this.sharedMethods.getFormValidators(entry);
      this.group[entry.key] = new FormControl('', validators);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {
    this.commonText = this.contentServ?.commonText;
    this.submitButtonText = this.commonText?.recordPayment;
  }

  async onSubmit(formData) {
    this.sharedMethods.showLoader(this.contentServ.commonText?.saving|| 'Saving payment' );
    const userData = await this.sharedMethods.getUserData();
    const now = this.sharedMethods.getCurrentDateTime();
    formData.created_at = formData.updated_at = now;
    formData.created_by = formData.updated_by = userData.id;
    // TODO: Remove this line when company_id is added to the userdata from the backend
    formData.company_id = userData.company_id || 1;
    formData.status = 'Pending';
    formData.file_url = formData.file_url.webPath
    const insertId = await this.paymentDataService.create(formData);

    this.router.navigate(['/payments/view/company', {id: insertId}]);
  }

  async addDeduction() {
    const modal = await this.modalCtrl.create({
      component: DeductionsPage,
      cssClass: 'tuna-modal'
    });

    modal.present();
    modal.onDidDismiss().then((deductionData) => {
      // TODO: Track all deductions that have been made
    });
  }
}
