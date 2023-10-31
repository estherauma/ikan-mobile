import { Component, OnInit } from '@angular/core';
import { ContractDataService } from '../../data/contract-data.service';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  pageData: any;
  htmlContent: any;

  constructor(
    public contractDataService: ContractDataService,
    public activatedRoute: ActivatedRoute,
    public contentService: ContentService,
    private sanitized: DomSanitizer
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.clauseDetails = params;
      this.pageSetup();
    });
  }

  pageSetup() {
    this.pageData = this.contentService.getContentByPropertyName(this.clauseContentObjectMapping[this.clauseDetails?.kind]);
    let pageContent = this.pageData?.pageContent;
    let pageTextArray = pageContent[0]?.description;
    let textHtml = '';
    console.log(pageTextArray);
    pageTextArray.forEach((element) => {
      textHtml += element?.paragraph;
      textHtml += '<br>';
    });
    console.log(textHtml);
    this.htmlContent = textHtml;
  }
  
}
