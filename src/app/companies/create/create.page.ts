import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
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
  isEditing: boolean = false;
  companyDetails: any;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public companiesDataService: CompaniesDataService,
    public modalCtrl: ModalController,
    public navParams: NavParams,
  ) {
    super(contentService);
  }

  ngOnInit() {
    this.pageSetup();
  }

  pageSetup() {
    this.isEditing = this.navParams.get('isEditing');
    this.companyDetails = this.navParams.get('company');
    this.commonText = this.contentService.commonText;
    this.submitButtonText = this.isEditing ? this.commonText?.update : this.commonText?.create;
    const pageData = this.contentService.getContentByPropertyName('company-create');
    // translate
    this.pageTitle = this.isEditing ? 'Edit Company' : pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      const validators = this.sharedMethods.getFormValidators(entry);
      if (this.isEditing && this.companyDetails[entry.key]) {
      this.group[entry.key] = new FormControl(this.companyDetails[entry.key], validators);
      } else {
        this.group[entry.key] = new FormControl('', validators);
      }
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  async onSubmit(formData) {
    // translate
    const submittingText = this.isEditing ? this.pageText?.updatingCompany : this.pageText?.SavingCompany;
    this.sharedMethods.showLoader(submittingText || 'Submitting...');
    const userData = await this.sharedMethods.getUserData();
    const now = this.sharedMethods.getCurrentDateTime();
    formData.updated_by = userData.id;
    formData.updated_at = now;
    formData.logo_url = ''; // Not yet implemented

    if (!this.isEditing) {
      formData.created_by = userData.id;
      formData.created_at = now;
      formData.app_ref = this.sharedMethods.generateAppRef();
      const insertId =  await this.companiesDataService.create(formData);
      this.modalCtrl.dismiss();
      this.sharedMethods.hideLoader();
      //translate
      this.sharedMethods.showToast(this.pageText?.companyCreated || 'Company created successfully');
    } else {
      const id = parseFloat(this.companyDetails.id);
      const result = await this.companiesDataService.update(formData, id);
      if (result?.rowsAffected) {
        this.modalCtrl.dismiss({ company: result.company, isEditing: false});
        this.sharedMethods.hideLoader();
        //translate
        this.sharedMethods.showToast(this.pageText?.companyUpdated || 'Company updated successfully');
      } else {
        this.sharedMethods.hideLoader();
        //translate
        this.sharedMethods.showToast(this.pageText?.companyUpdateError || 'Error updating company');
      }
    }
  }

}
