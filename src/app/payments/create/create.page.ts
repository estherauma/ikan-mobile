import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { DeductionsPage } from './deductions/deductions.page';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage extends BaseformPage implements OnInit  {
  pageTitle = '';
  submitButtonText = 'Record payment';

  constructor(
    public contentServ: ContentService,
    public modalCtrl: ModalController
  ) {
    super(contentServ);
    const pageData = this.contentServ.getContentByPropertyName('payment-create');
    this.pageTitle  = pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach(entry => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {
  }

  onSubmit(formValue) {
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
