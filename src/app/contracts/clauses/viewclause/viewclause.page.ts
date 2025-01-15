import { Component, OnInit } from '@angular/core';
import { ContractDataService } from '../../data/contract-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { VesselsDataService } from 'src/app/vessels/data/vessels-data.service';
import { AlertController } from '@ionic/angular';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { pageEventNames } from 'src/app/shared/services/analytics/event-names';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UserRole } from 'src/app/shared/types/api-types';

@Component({
  selector: 'app-viewclause',
  templateUrl: './viewclause.page.html',
  styleUrls: ['./viewclause.page.scss'],
})
export class ViewclausePage implements OnInit {
  // maps to prismic content page keys
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

  clauseMapping = {
    'Parties to this contract - Party A': 'contract-clauses-parties-requirement-vessel',
    'Parties to this contract - Party B': 'contract-clauses-parties-requirement-fishers',
    'Article 1 Period of validity': 'contract-clauses-contract-validity',
    'Article 2 Wage benefits and means of payment': 'contract-clauses-wage-benefits',
    'Article 5 Working hours rest and leave': 'contract-clauses-working-hours-rest-and-leave',
    'Article 6 Labor protection and benefits': 'contract-clauses-labor-protection-and-benefits',
    'Attachments': 'contract-clauses-attachments',
  }

  editableClauses = Object.values(this.clauseMapping);
  isEditable: boolean = false;
  editBtnText: string = 'Edit Clause';
  clauseDetails: any;
  clauseContent: any;
  pageData: any;
  htmlContent: any;
  pageName: string = '';
  allVessels: any = [];
  vesselDetails: any;
  commonText: any;
  isVesselOwner: boolean = false;
  isWorker: boolean = false;
  currentLanguage = 'en-us';

  constructor(
    public contractDataService: ContractDataService,
    public activatedRoute: ActivatedRoute,
    public contentService: ContentService,
    public vesselsDataService: VesselsDataService,
    public router: Router,
    public alertController: AlertController,
    public analytics: AnalyticsService,
    public sharedMethods: SharedmethodsService,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.clauseDetails = params;
      this.pageSetup();
      this.isVesselOwner = this.authService.userRole === UserRole.vesselOwner;
      this.isWorker = this.authService.userRole === UserRole.worker;
    });
    this.analytics.trackEvent(pageEventNames.viewClause, this.sharedMethods.analyticsEventParams);
  }

  async pageSetup() {
    this.vesselsDataService.getAll().subscribe((data) => {
      this.allVessels = data;
    });
    this.isEditable = this.editableClauses.includes(this.clauseDetails?.kind);
    this.commonText = this.contentService?.commonText;
    this.currentLanguage = this.contentService.currentLanguage;
    this.pageData = this.contentService.getContentByPropertyName(this.clauseContentObjectMapping[this.clauseDetails?.kind]);
    this.pageName = this.pageData?.pageName;
    this.editBtnText = this.commonText?.editClause;
    
    let pageContent = this.pageData?.pageContent;
    let pageTextArray = pageContent?.[0]?.description;
    let textHtml = '';
    
    pageTextArray.forEach((element, idx) => {
      if (idx === 0) {
        textHtml += element?.paragraph;
      } else if (element?.paragraph.startsWith('{{') &&  element?.paragraph.endsWith('}}')) {
        textHtml += '<br/>';
        textHtml += element?.paragraph;
      } else {
        textHtml += '<br/><br/>';
        textHtml += element?.paragraph;
      }
    });
    let formValues = await this.orderDataForClause(this.clauseDetails?.kind, this.clauseDetails?.data);
    this.htmlContent = this.fillPlaceHolders(textHtml, formValues)
  }

  fillPlaceHolders(inputString, placeholderValues) {
    let result = inputString;
    for (const key in placeholderValues) {
      if (placeholderValues.hasOwnProperty(key)) {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(placeholder, placeholderValues[key]);
      }
    }
    return result;
  }

  async orderDataForClause(clauseType, data) {
    let parsedObject = JSON.parse(data);
    switch (clauseType) {
      case 'contract-clauses-parties-requirement-vessel':
        let clauseOneData = await this.orderClauseOneData(parsedObject);
        return clauseOneData
      default:
        let replacement = await this.orderOtherClauses(parsedObject);
        return replacement;
    }
  }

  async orderClauseOneData(data) {
    let response = {};

    // TODO: remove after all old records are synced
    // This is a fix for old records that have different keys for rep details
    data = {
      ...data,
      representative: data?.representative ?? data?.respresentative,
      repAddress: data?.repAddress ?? data?.address,
      repTelephone: data?.repTelephone ?? data?.tel,
    }
    // End of fix

    for (const [key, value] of Object.entries(data)) {
      const formattedValue  = this.formatClauseValues(key, value);
      response[key] = formattedValue;
    }
    // clause one has two entries, so we need to add the second entry
    if  (this.clauseDetails?.partyB !== undefined || this.clauseDetails?.partyB !== null) {
      let partyBClauseDetails = await this.contractDataService.retrieveClauseDetails(this.clauseDetails?.partyB);

      // TODO: remove after all old records are synced/updated
      // This is a fix for old records that have different keys for crew details
      let crewContent = await JSON.parse(partyBClauseDetails.content);
      if (crewContent && Object.keys(crewContent).length) {
        crewContent = {
          ...crewContent,
          crewAddress: crewContent?.crewAddress ?? crewContent?.address,
          crewTelephone: crewContent?.crewTelephone ?? crewContent?.telephone,
        }
        partyBClauseDetails.content = JSON.stringify(crewContent);
      }
      let crewData = await JSON.parse(partyBClauseDetails.data);
      if (crewData && Object.keys(crewData).length) {
        crewData = {
          ...crewData,
          crewAddress: crewData?.crewAddress ?? crewData?.address,
          crewTelephone: crewData?.crewTelephone ?? crewData?.telephone,
        }
        partyBClauseDetails.data = JSON.stringify(crewData);
      }
      // End of fix
      
      let partyBDetails = partyBClauseDetails ? JSON.parse(partyBClauseDetails?.content) : {};
      for (const [key, value] of Object.entries(partyBDetails)) {
        const formattedValue  = this.formatClauseValues(key, value);
        response[key] = formattedValue;
      }
    }
    response['vesselName'] = this.vesselDetails?.name;
    response['vesselRegNo'] = this.vesselDetails?.regNo;
    return response;
  }

  // TODO: log data, sync fetch clause documents, attachments clause
  async orderOtherClauses(data) {
    // TODO: refactor payments & benefits data display
    if (!data?.paymentFrequencyDetails) {
      delete data.paymentFrequencyDetails;
    }

    let response = {};
    for (const [key, value] of Object.entries(data)) {
      const formattedValue  = this.formatClauseValues(key, value);
      response[key] = formattedValue;
    }
    return response;
  }

  formatClauseValues(key: string, value: any) {
    if (!value || !key) {
      return value;
    }

    if (key?.toLowerCase().includes('date')) {
      return this.sharedMethods.formatLocalDate(value, this.currentLanguage);
    } else if (key === 'partyASignature' || key === 'partyBSignature') {
      return `<img class="image" src="${value}" alt="image">`; 
    } else if (this.pageName === 'contract-clauses-parties-to-this-contract-content' && key === 'vessel') {
      const vessel = this.allVessels.find((vessel) => vessel.appRef === value);
      this.vesselDetails = vessel;
      return vessel?.name;
    } else if (this.pageName === 'contract-clauses-parties-to-this-contract-content' && key === 'crewMemberRole') {
      return this.contentService.getFormOptionTranslation('contract-clauses-parties-requirement-fishers', key, value);
    } else if (this.pageName === 'contract-clauses-wage-benefits-content' && (key === 'paymentFrequency' || key === 'paymentMethod')) {
      return this.contentService.getFormOptionTranslation('contract-clauses-wage-benefits', key, value);
    } else if (this.pageName === 'contract-clauses-attachments-content' && key === 'isCrewMemberAccount') {
      return this.contentService.getFormOptionTranslation('contract-clauses-attachments', key, value);
    }

    return value;
  }

  async editContractClause() {
    if (this.clauseDetails?.kind === 'contract-clauses-parties-requirement-vessel') {
      const alert = await this.getAlert();
      await alert.present();
    } else {
      let details = this.clauseDetails;
      const data = JSON.parse(details?.data);
      if (details?.kind === 'contract-clauses-attachments' && (data?.partyASignature || data?.partyBSignature)) {
        for (const [key, value] of Object.entries(data)) {
          if (key === 'partyASignature' || key === 'partyBSignature') { 
            data[key] = typeof value === 'string' && value?.endsWith('.pdf') ? { docType: 'pdf', fileUri: value} : {docType: 'image', webPath: value};
          }
        }
        
        details = {
          ...details,
          data: JSON.stringify(data),
        };
      }

      const clauseDetails = JSON.stringify(details);
      this.router.navigate(['/contracts/createdetails', {clauseDetails}], { queryParams: { isEditing: true } });
    }
  }

  async getAlert() {
    return await this.alertController.create({
      cssClass: 'parties-edit-alert',
      buttons: [
        {
          text: this.commonText?.editPartyADetails,
          cssClass: 'edit-btn',
          handler: () => {
            const partyAClauseDetails = JSON.stringify(this.clauseDetails);
            this.router.navigate(['/contracts/createdetails', {clauseDetails: partyAClauseDetails}], { queryParams: { isEditing: true } });
          }
        },
        {
          text: this.commonText?.editPartyBDetails,
          cssClass: 'edit-btn',
          handler: async() => {
            const partyBClause = await this.contractDataService.retrieveClauseDetails(this.clauseDetails?.partyB);
            partyBClause.data = partyBClause.content;
            partyBClause.partyAId = this.clauseDetails?.id;
            const partyBClauseDetails = JSON.stringify(partyBClause);
            this.router.navigate(['/contracts/createdetails', {clauseDetails: partyBClauseDetails}], { queryParams: { isEditing: true } });
          }
        },
        {
          text: this.commonText?.cancel,
          role: 'cancel',
          cssClass: 'cancel-btn',
        }
      ]
    });
  }
}
