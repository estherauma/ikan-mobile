import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { CompaniesDataService } from '../data/companies-data.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage extends BaseformPage implements OnInit {

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public companiesDataService: CompaniesDataService,
    public modalCtrl: ModalController
  ) {
    super(contentService);
    const pageData = this.contentService.getContentByPropertyName('company-create');
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {
    this.submitButtonText = this.contentService.commonText?.create;
  }

  async onSubmit(formData) {
    this.sharedMethods.showLoader(this.contentService.commonText?.saving || 'Saving');
    const userData = await this.sharedMethods.getUserData();
    const now = this.sharedMethods.getCurrentDateTime();
    formData.created_by = userData.id;
    formData.updated_by = userData.id;
    formData.created_at = formData.updated_at = now;
    formData.logo_url = '';
    formData.app_ref = this.sharedMethods.generateAppRef();
    const insertId =  await this.companiesDataService.create(formData);
    this.modalCtrl.dismiss();
  }

}
