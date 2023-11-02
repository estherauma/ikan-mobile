import { Component, OnInit } from '@angular/core';
import { ContractDataService } from '../../data/contract-data.service';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';

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
  }
  clauseDetails: any;
  clauseContent: any;
  pageData: any;
  htmlContent: any;

  constructor(
    public contractDataService: ContractDataService,
    public activatedRoute: ActivatedRoute,
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.clauseDetails = params;
      console.log(this.clauseDetails);
      this.pageSetup();
    });
  }

  async pageSetup() {
    this.pageData = this.contentService.getContentByPropertyName(this.clauseContentObjectMapping[this.clauseDetails?.kind]);
    console.log(this.pageData);
    let pageContent = this.pageData?.pageContent;
    let pageTextArray = pageContent[0]?.description;
    let textHtml = '';
    pageTextArray.forEach((element) => {
      textHtml += '<br/> <br/>';
      textHtml += element?.paragraph;
    });
    let formValues = await this.orderDataForClause(this.clauseDetails?.kind, this.clauseDetails?.data);
    this.htmlContent = this.fillPlaceHolders(textHtml, formValues)
  }

  fillPlaceHolders(inputString, placeholderValues) {
    let result = inputString;
    placeholderValues.forEach((element) => {
      result = result.replace('{{}}', `<br/> ${element}`);
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
      response.push(value)
    }
    // clause one has two entries, so we need to add the second entry
    if  (this.clauseDetails?.partyB !== undefined || this.clauseDetails?.partyB !== null) {
      let partyBClauseDetails = await this.contractDataService.retrieveClauseDetails(this.clauseDetails?.partyB);
      let partyBDetails = JSON.parse(partyBClauseDetails[0]?.content);
      for (const [key, value] of Object.entries(partyBDetails)) {
        response.push(value)
      }
    }
    return response;
  }

  async orderOtherClauses(data) {
    let response = [];
    for (const [key, value] of Object.entries(data)) {
      response.push(value)
    }
    return response;
  }
}
