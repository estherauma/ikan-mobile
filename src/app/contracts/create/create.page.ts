import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CompaniesDataService } from 'src/app/companies/data/companies-data.service';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { ContractDataService } from '../data/contract-data.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage extends BaseformPage implements OnInit {
  companies = [];
  taiwaneseCompanies = [];
  indonesianCompanies = [];

  constructor(
    public companiesDataService: CompaniesDataService,
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public router: Router,
    public contractsDataService: ContractDataService,
    public modalCtrl: ModalController
  ) {
    super(contentService);
    const pageData = this.contentService.getContentByPropertyName('companies-createcontract');
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  updateSelectOptions() {
    this.formQuestions.forEach((entry) => {
      if (entry.key === 'taiwanese_company_id') {
        entry.options = this.taiwaneseCompanies;
      }
      if (entry.key === 'indonesian_company_id') {
        entry.options = this.indonesianCompanies;
      }
    });
  }

  ngOnInit() {
    this.submitButtonText = this.contentService.commonText?.create;
    this.companiesDataService.getAll().subscribe((data) => {
      data.forEach((entry) => {
        // TODO: This is a hack. Fix it. First entry is with dummy wrong data
        // TODO: Change values that are pushed to include the id of the company
        if (entry.country === ' Taiwan' || entry.country === 'Taiwan') {
          this.taiwaneseCompanies.push(entry.name);
        }
        if (entry.country === 'Indonesia') {
          this.indonesianCompanies.push(entry.name);
        }
      });
      this.updateSelectOptions();
    });
  }


  async onSubmit(formData) {
    this.sharedMethods.showLoader('Saving contract');
    const userData = await this.sharedMethods.getUserData();
    const now = this.sharedMethods.getCurrentDateTime();
    formData.internal_ref = formData.app_ref;
    formData.created_by = userData.id;
    formData.updated_by = userData.id;
    formData.created_at = formData.updated_at = now;
    const insertId =  await this.contractsDataService.create(formData);
    this.modalCtrl.dismiss();
  }
}
