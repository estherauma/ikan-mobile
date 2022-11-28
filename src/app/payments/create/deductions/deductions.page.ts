import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-deductions',
  templateUrl: './deductions.page.html',
  styleUrls: ['./deductions.page.scss'],
})
export class DeductionsPage extends BaseformPage  implements OnInit {
  submitButtonText = 'Add Deduction';
  constructor(
    public contentServ: ContentService,
    public modalCtrl: ModalController
  ) {
    super(contentServ);
    const deductionsData = this.contentServ.getContentByPropertyName('payment-deductions');
    this.formQuestions = deductionsData?.formQuestions;
    this.formQuestions.forEach((q) => {
      this.group[q.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {

  }

  onSubmit(formData) {

  }

}
