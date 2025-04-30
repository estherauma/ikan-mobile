import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { CompaniesDataService } from 'src/app/companies/data/companies-data.service';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { ContractDataService } from '../data/contract-data.service';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { SyncService } from 'src/app/shared/services/sync/sync.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage extends BaseformPage implements OnInit {
  companies = [];
  taiwaneseCompanies = [];
  indonesianCompanies = [];
  pageText: any;
  isEditing = false;
  contractDetails: any;

  constructor(
    public companiesDataService: CompaniesDataService,
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public router: Router,
    public contractsDataService: ContractDataService,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public analytics: AnalyticsService,
    public syncService: SyncService,
  ) {
    super(contentService);
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
    this.commonText = this.contentService?.commonText;
    this.isEditing = this.navParams.get('isEditing');
    this.contractDetails = this.navParams.get('contractDetails');
    this.submitButtonText = this.isEditing ? this.commonText?.update :this.commonText?.create;
    
    this.pageSetup();
    this.analytics.trackEvent(PageEventNames.createContract, this.sharedMethods.analyticsEventParams);
  }

  pageSetup() {
    const pageData = this.contentService.getContentByPropertyName('companies-createcontract');
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData.additionalText);
    this.pageTitle = this.isEditing ? this.pageText?.editContract : pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      const validators = this.sharedMethods.getFormValidators(entry);
      if (this.isEditing && this.contractDetails[entry.key]) {
        this.group[entry.key] = new FormControl(this.contractDetails[entry.key], validators);
      } else {
        this.group[entry.key] = new FormControl('', validators);
      }
    });
    this.pageFormGroup = new FormGroup(this.group);
    
    this.companiesDataService.getAll().subscribe((data) => {
      data.forEach((entry) => {
        if (entry.country === ' Taiwan' || entry.country === 'Taiwan') {
          this.taiwaneseCompanies.push({label: entry.name, value: entry.id});
        }
        if (entry.country === 'Indonesia') {
          this.indonesianCompanies.push({label: entry.name, value: entry.id});
        }
      });
      this.updateSelectOptions();
    });
  }


  async onSubmit(formData) {
    const submittingText = this.isEditing ? this.pageText?.updatingContract : this.pageText?.savingContract;
    this.sharedMethods.showLoader(submittingText);
    const userData = await this.sharedMethods.getUserData();
    const now = this.sharedMethods.getCurrentDateTime();
    formData.internal_ref = formData.app_ref = this.sharedMethods.generateAppRef();
    formData.updated_by = userData.id;
    formData.updated_at = now;

    if (!this.isEditing) {
      formData.created_by = userData.id;
      formData.created_at = now;
      const insertId =  await this.contractsDataService.create(formData);
      if (insertId) {
        if (formData?.file?.uriPath || formData?.file?.fileUrl) {
          const contractFileData = {
            contract_id: insertId,
            name: formData?.file.fileName, // TODO: change to actual name not generated one
            url: formData?.file.uriPath || formData?.file.fileUrl,
            status: '', // TODO: update status
          };
          const docInsertId = await this.contractsDataService.createContractDocument(contractFileData);
          if (!docInsertId) {
            this.sharedMethods.showToast(this.pageText?.errSavingDocument);
          }
        }
        await this.createStaticContractClauses(insertId);
        
        await this.syncService.syncContracts();
        this.modalCtrl.dismiss();
      } else {
        this.sharedMethods.showToast(this.pageText?.errCreatingContract);
      }
    } else {
      formData.id = this.contractDetails.id;
      const result = await this.contractsDataService.update(formData);
      if (result?.rowsAffected > 0) {
        let contractDetails = result?.contract;
          if (await this.contractsDataService.contractDocumentExists(this.contractDetails.id)) {
            const fileEditData = {
              contract_id: formData.id,
              name: formData?.file.fileName, // TODO: change to actual name not generated one
              url: formData?.file.uriPath || formData?.file.fileUrl,
              status: '', // TODO: update status
            };
            const result = await this.contractsDataService.updateContractDocument(formData.id, fileEditData);
            if (result?.rowsAffected <= 0) {
              this.sharedMethods.showToast(this.pageText?.errSavingDocument);
            } else {
              contractDetails = {
                ...contractDetails,
                file: {
                  uriPath: result.doc.url,
                  fileUrl: result.doc.url,
                  fileName: result.doc.name,
                  docType: 'pdf'
                }
              };
            }
          } else {
            if (formData?.file?.uriPath || formData?.file?.fileUrl) {
              const contractFileData = {
                contract_id: formData.id,
                name: formData?.file.fileName, // TODO: change to actual name not generated one
                url: formData?.file.uriPath || formData?.file.fileUrl,
                status: '', // TODO: update status
              };
              const savedDocId = await this.contractsDataService.createContractDocument(contractFileData);
              if (!savedDocId) {
                this.sharedMethods.showToast(this.pageText?.errSavingDocument);
              } else {
                const savedDoc = await this.contractsDataService.getContractDocumentByField('id', savedDocId);
                contractDetails = {
                  ...contractDetails,
                  file: {
                    uriPath: savedDoc.url,
                    fileUrl: savedDoc.url,
                    fileName: savedDoc.name,
                    docType: 'pdf'
                  }
                };
              }
            }
          }

        await this.syncService.syncContracts();
        this.modalCtrl.dismiss({contractDetails, isEditing: false});
      } else {
        this.sharedMethods.showToast(this.pageText?.errUpdatingContract);
      }
    }
  }

  async createStaticContractClauses(contractId) {
    // Article 3, 4, 7, 8, 9 10 have static content and we need to create clauses for them from here
    const clauseMapping = {
      'article3': 'contract-clauses-accident-medical-and-life-insurance',
      'article4': 'contract-clauses-transportation-severance-food-accomodation',
      'article7':'contract-clause-requirements-that-party-b-must-comply-with',
      'article8': 'contract-clauses-means-to-address-breach-of-contract',
      'article9': 'contract-clauses-dispute-settlement',
      'article10': 'contract-clauses-miscellaneous'
    }
    const userData = await this.sharedMethods.getUserData();
    for (const [key, value] of Object.entries(clauseMapping)) {
      const now = this.sharedMethods.getCurrentDateTime();
      const clauseData = this.contentService.getContentByPropertyName(`${value}-content`)
      let contractClauseData = {}
      contractClauseData['content'] = JSON.stringify({});
      contractClauseData['app_ref'] = this.sharedMethods.generateAppRef();
      contractClauseData['created_by'] = userData.id;
      contractClauseData['updated_by'] = userData.id;
      contractClauseData['created_at'] = contractClauseData['updated_at'] = now;
      contractClauseData['kind'] = value;
      contractClauseData['name'] = clauseData?.pageTitle;
      this.contractsDataService.saveContractClause(contractId, contractClauseData);
    }

  }
}
