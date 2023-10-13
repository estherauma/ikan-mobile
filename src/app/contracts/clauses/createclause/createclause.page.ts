import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-createclause',
  templateUrl: './createclause.page.html',
  styleUrls: ['./createclause.page.scss'],
})
export class CreateclausePage extends BaseformPage implements OnInit {

  constructor(
    public contentService: ContentService,
    public router: Router,
    public apiService: ApiService,
    public sharedMethods: SharedmethodsService,
    public modalCtrl: ModalController
  ) {
    super(contentService);
   }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.pageSetup();
  }

  pageSetup(){
    const pageData = this.contentService.getContentByPropertyName('contract-create-clause');
    this.formQuestions = pageData.formQuestions;
    this.pageTitle = pageData?.pageTitle;
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.submitButtonText = this.pageText?.submitButtonText;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  onSubmit(formData) {
    this.modalCtrl.dismiss();
    this.router.navigate(['/contracts/createdetails', formData]);
  }

}
