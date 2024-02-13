import { Component, OnInit } from '@angular/core';
import { ContractDataService } from '../../data/contract-data.service';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { formatDate } from '@angular/common';
import { VesselsDataService } from 'src/app/vessels/data/vessels-data.service';

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
  clauseDetails: any;
  clauseContent: any;
  pageData: any;
  htmlContent: any;
  pageName: string = '';
  allVessels: any = [];
  vesselDetails: any;

  constructor(
    public contractDataService: ContractDataService,
    public activatedRoute: ActivatedRoute,
    public contentService: ContentService,
    public vesselsDataService: VesselsDataService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.clauseDetails = params;
      this.pageSetup();
    });
  }

  async pageSetup() {
    this.vesselsDataService.getAll().subscribe((data) => {
      this.allVessels = data;
    });
    this.pageData = this.contentService.getContentByPropertyName(this.clauseContentObjectMapping[this.clauseDetails?.kind]);
    this.pageName = this.pageData?.pageName;
    let pageContent = this.pageData?.pageContent;
    let pageTextArray = pageContent[0]?.description;
    let textHtml = '';
    pageTextArray.forEach((element, idx) => {
      if (idx === 0) {
        textHtml += element?.paragraph;
      } else if (element?.paragraph === '{{}}') {
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
    placeholderValues.forEach((element) => {
      result = result.replace('{{}}', `${element}`);
    });
    return result;
  }

  async orderDataForClause(clauseType, data) {
    let parsedObject = JSON.parse(data);
    let replacement = []
    switch (clauseType) {
      case 'contract-clauses-parties-requirement-vessel':
        let clauseOneData = await this.orderClauseOneData(parsedObject);
        return clauseOneData
      default:
        let replacement = await this.orderOtherClauses(parsedObject);
        return replacement
    }
  }

  async orderClauseOneData(data) {
    let response = [];
    for (const [key, value] of Object.entries(data)) {
      const formattedValue  = this.formatClauseValues(key, value);
      response.push(formattedValue);
    }
    // clause one has two entries, so we need to add the second entry
    if  (this.clauseDetails?.partyB !== undefined || this.clauseDetails?.partyB !== null) {
      let partyBClauseDetails = await this.contractDataService.retrieveClauseDetails(this.clauseDetails?.partyB);
      let partyBDetails = JSON.parse(partyBClauseDetails[0]?.content);
      for (const [key, value] of Object.entries(partyBDetails)) {
        const formattedValue  = this.formatClauseValues(key, value);
        response.push(formattedValue);
      }
    }
    // The values for the clause are repeated at the bottom of clause one details. These are passport/id, 
    // in the responses array, add the 7th, 14th, 14th and 14th item end of the array in that order
    response.push(response[7]);
    response.push(response[15]);
    response.push(this.vesselDetails?.name);
    response.push(this.vesselDetails?.regNo);
    return response;
  }

  async orderOtherClauses(data) {
    // TODO: refactor payments & benefits data display
    if (!data?.paymentFrequencyDetails) {
      delete data.paymentFrequencyDetails;
    }

    let response = [];
    for (const [key, value] of Object.entries(data)) {
      const formattedValue  = this.formatClauseValues(key, value);
      response.push(formattedValue)
    }
    return response;
  }

  formatClauseValues(key: string, value: any) {
    if (!value || !key) {
      return value;
    }

    if (key?.toLowerCase().includes('date')) {
      // TODO: check which format to use so that we have uniformity in the app
      return formatDate(value, 'yyyy/MM/dd', 'en-us');
    } else if (key === 'partyASignature' || key === 'partyBSignature') {
      return `<img class="image" src="${value}" alt="image">`; 
    } else if (this.pageName === 'contract-clauses-parties-to-this-contract-content' && key === 'vessel') {
      const vessel = this.allVessels.find((vessel) => vessel.appRef === value);
      this.vesselDetails = vessel;
      return vessel?.name;
    }

    return value;
  }
}
