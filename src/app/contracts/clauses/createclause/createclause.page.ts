import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { ContractDataService } from '../../data/contract-data.service';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { pageEventNames } from 'src/app/shared/services/analytics/event-names';

@Component({
  selector: 'app-createclause',
  templateUrl: './createclause.page.html',
  styleUrls: ['./createclause.page.scss'],
})
export class CreateclausePage extends BaseformPage implements OnInit {
  contractId: any;
  contract: any;
  clauseExistsText = 'This clause already exists in the contract';
  clauseMapping = {
    'Parties to this contract - Party A': 'contract-clauses-parties-requirement-vessel',
    'Parties to this contract - Party B': 'contract-clauses-parties-requirement-fishers',
    'Article 1 Period of validity': 'contract-clauses-contract-validity',
    'Article 2 Wage benefits and means of payment': 'contract-clauses-wage-benefits',
    'Article 5 Working hours rest and leave': 'contract-clauses-working-hours-rest-and-leave',
    'Article 6 Labor protection and benefits': 'contract-clauses-labor-protection-and-benefits',
    'Attachments': 'contract-clauses-attachments',
  };

  constructor(
    public contentService: ContentService,
    public router: Router,
    public apiService: ApiService,
    public sharedMethods: SharedmethodsService,
    public modalCtrl: ModalController,
    public contractDataService: ContractDataService,
    public analytics: AnalyticsService
  ) {
    super(contentService);
   }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.pageSetup();
    this.analytics.trackEvent(pageEventNames.createClause, this.sharedMethods.analyticsEventParams);
  }

  pageSetup() {
    const pageData = this.contentService.getContentByPropertyName('contract-create-clause');
    this.formQuestions = pageData.formQuestions;
    this.pageTitle = pageData?.pageTitle;
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.submitButtonText = this.pageText?.submitButtonText;
    this.clauseExistsText = this.pageText?.clauseExistsText;
    this.formQuestions.forEach((entry) => {
      const validators = this.sharedMethods.getFormValidators(entry);
      this.group[entry.key] = new FormControl('', validators);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  async onSubmit(formData) {
    formData.contractId = this.contractId;
    formData.contractOnlineRef = this.contract.onlineRef ?? null;
    // if the clause kind selected exists, don't add again
    const clauseKind = this.clauseMapping[formData['clause-type'].trim()];
    const clauseExists = await this.checkIfClauseExists(this.contractId, clauseKind);
    if (clauseExists) {
      this.modalCtrl.dismiss();
      this.sharedMethods.showToast(this.clauseExistsText);
      return;
    }

    const prefillDetails = await this.getPrefillDetails(clauseKind);
    if (prefillDetails) {
      formData.prefillDetails = prefillDetails;
    }

    this.modalCtrl.dismiss();
    this.router.navigate(['/contracts/createdetails', formData]);
  }

  async checkIfClauseExists(contractId, clauseKind) {
    const response = await this.contractDataService.retrieveContractClauses(contractId);
    const clauseExists = response.some((entry) => entry.kind === clauseKind );
    return clauseExists;
  }

  async getPrefillDetails(clauseKind) {
    if (!clauseKind) {
      return null;
    }

    if (clauseKind === 'contract-clauses-contract-validity') {
      const validityDates = {
        validityStartDate: this.contract.startDate,
        validityEndDate: this.contract.endDate
      };
      return JSON.stringify(validityDates);
    } else if (clauseKind === 'contract-clauses-parties-requirement-fishers') {
      const partyBDetails = {
        crewName: this.contract.name
      };
      return JSON.stringify(partyBDetails);
    } else if (clauseKind === 'contract-clauses-parties-requirement-vessel') {
      const user =  await this.sharedMethods.getUserData();
      const clauses = await this.contractDataService.retrieveContractClausesByField('kind', clauseKind);
      const clauseByUser = clauses.find((entry) => entry.createdBy === user.id);
      if (clauseByUser) {
        return clauseByUser.content;
      }
      return null;
    }
    return null;
  }
}
