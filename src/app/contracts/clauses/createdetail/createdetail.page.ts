import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { ContractDataService } from '../../data/contract-data.service';
import { VesselsDataService } from 'src/app/vessels/data/vessels-data.service';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { pageEventNames } from 'src/app/shared/services/analytics/event-names';
import { SyncService } from 'src/app/shared/services/sync/sync.service';

@Component({
  selector: 'app-createdetail',
  templateUrl: './createdetail.page.html',
  styleUrls: ['./createdetail.page.scss'],
})
export class CreatedetailPage extends BaseformPage implements OnInit {
  clauseMapping = {
    'Parties to this contract - Party A': 'contract-clauses-parties-requirement-vessel',
    'Parties to this contract - Party B': 'contract-clauses-parties-requirement-fishers',
    'Article 1 Period of validity': 'contract-clauses-contract-validity',
    'Article 2 Wage benefits and means of payment': 'contract-clauses-wage-benefits',
    'Article 5 Working hours rest and leave': 'contract-clauses-working-hours-rest-and-leave',
    'Article 6 Labor protection and benefits': 'contract-clauses-labor-protection-and-benefits',
    'Attachments': 'contract-clauses-attachments',
  };
  objectTolookup: string;
  contractId: any;
  contractOnlineRef: any;
  isPartyBForm = false;
  isPartyAForm = false;
  vessels: any = [];
  noVesselsText = 'No vessels found. Please add a vessel first';
  isEditing = false;
  clauseDetails: any;
  formValues: any;
  editClauseText = 'Edit Clause';
  userData: any;

  constructor(
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
    public sharedMethods: SharedmethodsService,
    private contractDataServ: ContractDataService,
    public router: Router,
    public vesselsDataService: VesselsDataService,
    public analytics: AnalyticsService,
    public syncService: SyncService,
  ) {
    super(contentService);
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams?.isEditing) {
        this.isEditing = true;
      }
    });
    this.activatedRoute.params.subscribe(async(params) => {
      if (!this.isEditing) {
        // we use this to search the content by the key to load the form we need.
        this.objectTolookup = params?.['clause-type'];
        // remove whitespace from beginning and end of string
        this.objectTolookup = this.objectTolookup?.trim();
        this.contractId = params?.['contractId'];
        if (params.contractOnlineRef && params.contractOnlineRef !== 'undefined' && params.contractOnlineRef !== 'null') {
          this.contractOnlineRef = params.contractOnlineRef;
        }
        if (params.prefillDetails) {
          this.formValues = JSON.parse(params.prefillDetails);
        }

        // TODO: Add a check to see if the contract clause exists
        // We should be able to fetch it and display it for the user to edit
      } else {
        this.clauseDetails = JSON.parse(params.clauseDetails);
        this.formValues = JSON.parse(this.clauseDetails?.data);
      }
      await this.pageSetup();
    });
    this.analytics.trackEvent(pageEventNames.createClauseDetails, this.sharedMethods.analyticsEventParams);
  }

  async pageSetup() {
    this.userData = await this.sharedMethods.getUserData();
    const property = this.isEditing ? this.clauseDetails['kind'] : this.clauseMapping[this.objectTolookup];
    const pageData = this.contentService.getContentByPropertyName(property);
    if (!pageData) {
      this.sharedMethods.showToast(this.commonText?.somethingWentWrong);
      return;
    }
    const pageName = pageData?.pageName;
    if (pageName === 'contract-clauses-parties-requirement-fishers') {
      this.isPartyBForm = true;
    } else if (pageName === 'contract-clauses-parties-requirement-vessel') {
      this.isPartyAForm = true;
    }

    this.vesselsDataService.getAll().subscribe((data) => {
      this.vessels = data.filter((vessel) => vessel.createdBy === this.userData?.id);
    });

    this.editClauseText = this.commonText?.editClause;
    this.pageTitle = pageData?.pageTitle;
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.noVesselsText = this.pageText?.noVesselsText || this.noVesselsText;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      const validators = this.sharedMethods.getFormValidators(entry);
      if (this.formValues?.[entry.key]) {
        this.group[entry.key] = new FormControl(this.formValues[entry.key], validators);
      } else {
        this.group[entry.key] = new FormControl('', validators);
      }

      // add change listener to payment frequency
      if (entry.key === 'paymentFrequency') {
        this.group[entry.key].valueChanges.subscribe((value) => {
          this.paymentFrequencyChanged(value);
        });
      }

      // add change listener to payment method
      if (entry.key === 'paymentMethod') {
        this.group[entry.key].valueChanges.subscribe((value) => {
          this.paymentMethodChanged(value);
        });
      }

      // add change listener to attachment page account
      if (entry.key === 'isCrewMemberAccount') {
        this.group[entry.key].valueChanges.subscribe((value) => {
          this.isCrewMemberAccountChanged(value);
        });
      }

      // add vessel options (parties B clause)
      if (this.isPartyBForm && entry.key === 'vessel') {
        const options = this.vessels.map((vessel) => ({ label: vessel.name, value: vessel.appRef }));
        entry.options = options;
      }
    });
    this.pageFormGroup = new FormGroup(this.group);
    this.submitButtonText = this.pageText?.submitButtonText;
  }

  async onSubmit(formData) {
    const userData = await this.sharedMethods.getUserData();
    const now = this.sharedMethods.getCurrentDateTime();
    if (formData.partyASignature || formData.partyBSignature) {
      const partyASignature = formData.partyASignature ? (formData.partyASignature.docType === 'image' ? formData.partyASignature.webPath : formData.partyASignature.uriPath) : '';
      const partyBSignature = formData.partyBSignature ? (formData.partyBSignature.docType === 'image' ? formData.partyBSignature.webPath : formData.partyBSignature.uriPath) : '';
      formData = {
        ...formData,
        partyASignature,
        partyBSignature,
      };
    }

    if (!this.isEditing) {
      // We need this information before we append meta data
      formData.content = JSON.stringify(formData);
      formData.app_ref = this.sharedMethods.generateAppRef();
      formData.created_by = userData.id;
      formData.updated_by = userData.id;
      formData.created_at = formData.updated_at = now;
      formData.kind = this.clauseMapping[this.objectTolookup];
      formData.name = this.pageTitle;
      await this.contractDataServ.saveContractClause(this.contractId, formData)
      .then(async(result) => {
        this.sharedMethods.showToast(this.contentService.commonText?.clauseSaved);

        if (this.contractOnlineRef) {
          await this.syncService.syncContractClauses(this.contractId, this.contractOnlineRef);
        }
        this.router.navigate(['/contracts/view', {id: this.contractId}], { replaceUrl: true });
      });
    } else {
      // We are basically updating only the content
      const editObj = {
        content: JSON.stringify(formData),
        updated_by: userData.id,
        updated_at: now,
        id: parseFloat(this.clauseDetails.id),
      };

      const result = await this.contractDataServ.updateContractClause(editObj.id, editObj);
      if (result) {
        this.sharedMethods.showToast(this.contentService.commonText?.clauseUpdated);

        if (this.isPartyBForm) {
          // Party A and B clause are displayed together
          // So we navigate to party A clause and in turn party B will be fetched
          const partyAId = this.clauseDetails?.partyAId;
          const partyAClause = await this.contractDataServ.retrieveClauseDetails(partyAId);
          partyAClause.partyB = this.clauseDetails.id;
          this.router.navigate(['/contracts/clauses/viewclause/', partyAClause], { replaceUrl: true });
          return;
        } else if (this.isPartyAForm) {
          result.clause.partyB = this.clauseDetails.partyB;
        }
        // TODO: sync clause immediately after updating
        // id and onlineref are undefined
        // if (this.contractOnlineRef) {
        //   await this.syncService.syncContractClauses(this.contractId, this.contractOnlineRef);
        // }
        this.router.navigate(['/contracts/clauses/viewclause/', result.clause], { replaceUrl: true })
      } else {
        this.sharedMethods.showToast(this.contentService.commonText?.errorUpdatingClause);
      }
    }
  }

  paymentFrequencyChanged(value) {
    switch (value.trim()) {
      case 'Every month': {
        this.formQuestions.forEach((entry) => {
          if (entry.key === 'paymentFrequencyDetails')  {
            entry.displayquestion = false;
            return;
          }
        });
        break;
      }
      case 'Other': {
        // show the paymentFrequencyDetails form control
        this.formQuestions.forEach((entry) => {
          if (entry.key === 'paymentFrequencyDetails')  {
            entry.displayquestion = true;
            return;
          }
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  paymentMethodChanged(value) {
    switch (value.trim()) {
      case 'Partly cash & partly bank transfer': {
        // show the cashAmount and bankTransferAmount form controls
        this.formQuestions.forEach((entry) => {
          if (entry.key === 'bankTransferAmount' || entry.key === 'cashAmount')  {
            entry.displayquestion = true;
            // can't return here because I need it to go through all of them to find both
          }
        });
        break;
      }
      default: {
        this.formQuestions.forEach((entry) => {
          if (entry.key === 'bankTransferAmount' || entry.key === 'cashAmount')  {
            entry.displayquestion = false;
            // can't return here because I need it to go through all of them to find both
          }
        });
        break;
      }
    }
  }

  isCrewMemberAccountChanged(value) {
    switch (value.trim()) {
      case 'Yes': {
        this.formQuestions.forEach((entry) => {
          if (entry.key === 'relativePhoneNumber' ||
            entry.key === 'relativeWhatspp' ||
            entry.key === 'relativeFb' ||
            entry.key === 'relativeOthers'
          )  {
            entry.displayquestion = true;
          }
        });
        break;
      }
      default: {
        this.formQuestions.forEach((entry) => {
          if (
            entry.key === 'relativePhoneNumber' ||
            entry.key === 'relativeWhatspp' ||
            entry.key === 'relativeFb' ||
            entry.key === 'others'
          )  {
            entry.displayquestion = false;
          }
        });
        break;
      }
    }
  }
}
