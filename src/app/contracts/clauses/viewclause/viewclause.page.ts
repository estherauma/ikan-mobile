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
      this.pageSetup();
    });
  }

  async pageSetup() {
    this.pageData = this.contentService.getContentByPropertyName(this.clauseContentObjectMapping[this.clauseDetails?.kind]);
    let pageContent = this.pageData?.pageContent;
    let pageTextArray = pageContent[0]?.description;
    let textHtml = '';
    pageTextArray.forEach((element) => {
      textHtml += '<br/> <br/>';
      textHtml += element?.paragraph;
    });
    // let clauseReplacement = await this.getClauseDetails();
    console.log(this.clauseDetails);
    this.htmlContent = this.fillPlaceHolders(textHtml, ['one', 'two', 'three', 'four', 'five', 'six', 'seve', 'eight', 'nine', 'ten', 'eleven'])
  }

  fillPlaceHolders(inputString, placeholderValues) {
    let result = inputString;
    placeholderValues.forEach((element) => {
      result = result.replace('{{}}', `<br/> ${element}`);
    });
    return result;
  }

  async getClauseDetails() {
    const clause = await this.contractDataService.retrieveClauseDetails(this.clauseDetails?.id);
    this.clauseContent = clause;
    console.log(this.clauseContent)
    return clause
  }
}
