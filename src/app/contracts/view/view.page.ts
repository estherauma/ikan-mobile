import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../shared/services/content/content.service';
import { ModalController } from '@ionic/angular';
import { CreateclausePage } from '../clauses/createclause/createclause.page';
import { ContractDataService } from '../data/contract-data.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CompaniesDataService } from 'src/app/companies/data/companies-data.service';
import { CreatePage } from '../create/create.page';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  // Duplicated. See how to DRY
  clauseContentObjectMapping = {
    'contract-clauses-parties-requirement-vessel': 'contract-clauses-parties-to-this-contract-content',
    'contract-clauses-contract-validity':'contract-clauses-contract-validity-content',
    'contract-clauses-wage-benefits': 'contract-clauses-wage-benefits-content',
    'contract-clauses-working-hours-rest-and-leave': 'contract-clauses-working-hours-rest-and-leave-content',
    'contract-clauses-labor-protection-and-benefits': 'contract-clauses-labor-protection-and-benefits-content',
    'contract-clauses-attachments': 'contract-clauses-attachments-content',
    'contract-clauses-accident-medical-and-life-insurance': 'contract-clauses-accident-medical-and-life-insurance-content',
    'contract-clauses-transportation-severance-food-accomodation': 'contract-clauses-transportation-severance-food-accomodation-content',
    'contract-clause-requirements-that-party-b-must-comply-with':'contract-clause-requirements-that-party-b-must-comply-with-content',
    'contract-clauses-means-to-address-breach-of-contract': 'contract-clauses-means-to-address-breach-of-contract-content',
    'contract-clauses-dispute-settlement': 'contract-clauses-dispute-settlement-content',
    'contract-clauses-miscellaneous': 'contract-clauses-miscellaneous-content'
  }
  commonText: any;
  pageTitle: string;
  contract;
  contractClauses = [];
  done = false; // TODO: add done logic
  partiesRequirementId: string;
  createClauseText: string = 'Add new clause';
  pageText: any;
  editContractText: string = 'Edit contract';


  constructor(
    public activatedRoute: ActivatedRoute,
    public contentService: ContentService,
    public modalController: ModalController,
    public contractDataService: ContractDataService,
    public sharedMethods: SharedmethodsService,
    public authService: AuthService,
    public companiesDataService: CompaniesDataService,
    public router: Router,
  ) {}

  ngOnInit() {
    // TODO: Consider refactoring this method to smaller functions
    this.commonText = this.contentService?.commonText;
    this.activatedRoute.params.subscribe((params) => {
      this.contract = params;
      if (params.name === 'undefined' || params.name === undefined) {
        this.contract = this.contractDataService.getSingleContract(params.id);
      }
      this.pageTitle = params.name;
      this.contractDataService.retrieveContractClauses(this.contract.id)
      .then((response) => {
        response.forEach((entry) => {
          // Avoid adding the clause twice.
          // TODO: Add logic to check if clause is included when creating clauses
          const clauseIncluded = this.contractClauses.some((clause) => {
            return clause.title === entry.name;
          });
          if (clauseIncluded) {
            return;
          }
          if (entry.kind === 'contract-clauses-parties-requirement-fishers') {
            // Parties requirement has two entires, so ignore and exit loop
            // TODO: fix value, it's currently undefined
            this.partiesRequirementId = entry.id;
            return;
          } else {
            const clauseDetails = this.contentService.getContentByPropertyName(this.clauseContentObjectMapping[entry.kind]);
            this.contractClauses.push({
              title: entry.name,
              translatedTitle: clauseDetails?.pageTitle,
              id: entry.id,
              kind: entry.kind,
              entry: entry,
              data: entry.content,
              order: this.addOrderDataToClause(entry.kind)
            })
          }
        });
        // order contractClauses by order
        this.contractClauses = this.contractClauses.sort((a, b) => a.order - b.order);
      });
    });

    this.pageSetup();
  }

  addOrderDataToClause(clauseKind: string) {
    // TODO: Update the clause save logic and the respective table to save order and then sort by order
    const clauseOrder = {
      'contract-clauses-parties-requirement-vessel': 0,
      'contract-clauses-contract-validity':1,
      'contract-clauses-wage-benefits': 2,
      'contract-clauses-accident-medical-and-life-insurance': 3,
      'contract-clauses-transportation-severance-food-accomodation': 4,
      'contract-clauses-working-hours-rest-and-leave': 5,
      'contract-clauses-labor-protection-and-benefits': 6,
      'contract-clause-requirements-that-party-b-must-comply-with': 7,
      'contract-clauses-means-to-address-breach-of-contract': 8,
      'contract-clauses-dispute-settlement': 9,
      'contract-clauses-miscellaneous': 10,
      'contract-clauses-attachments': 11,
    }
    return clauseOrder[clauseKind];
  }

  getCompanyName(companyId) {
    const companies = this.companiesDataService.companies;
    if (!companies.length) {
      return '';
    }
    const company = companies.find((entry) => entry.id === parseFloat(companyId));
    return company?.name || '';
  }

  async createClause() {
    const modal = await this.modalController.create({
      component: CreateclausePage,
      cssClass: 'notification-modal',
      componentProps: {
        contractId: this.contract.id,
      }
    });
    modal.present();
    modal.onDidDismiss().then((data) => {
    });
  }

  pageSetup() {
    const pageData = this.contentService.getContentByPropertyName('contracts-view-clause');
    if (!pageData) {
      return;
    }
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.createClauseText = this.pageText?.addNewClause;
    // TODO: translate
    this.editContractText = this.pageText?.editContract ?? this.editContractText;
  }

  async editContract() {
    const contractDetails = {
      ...this.contract,
      id: parseFloat(this.contract.id),
      app_ref: this.contract.appRef,
      internal_ref: this.contract.internalRef,
      start_date: this.contract.startDate,
      end_date: this.contract.endDate,
      online_ref: this.contract.onlineRef,
      type: this.contract.kind,
      taiwanese_company_id: this.contract.taiwaneseCompany,
      indonesian_company_id: this.contract.indonesianCompany,
    };

    const modal = await this.modalController.create({
      cssClass: 'notification-modal',
      component: CreatePage,
      componentProps: {
        contractDetails,
        isEditing: true,
      }
    });
    modal.present();
    modal.onDidDismiss().then((data) => {
      if (data?.data?.contractDetails && Object.keys(data.data.contractDetails)?.length) {
        this.contract = data.data?.contractDetails;
      }
    });
  }
}
