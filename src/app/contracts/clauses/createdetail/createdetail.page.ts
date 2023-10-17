import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-createdetail',
  templateUrl: './createdetail.page.html',
  styleUrls: ['./createdetail.page.scss'],
})
export class CreatedetailPage extends BaseformPage implements OnInit {
  clauseMapping = {
    'Parties to this contract - Party A': 'contract-clauses-parties-requirement-vessel',
    'Parties to this contract - Party B': 'contract-clauses-parties-requirement-fishers'
  }
  objectTolookup: string;
  contractId: any

  constructor(
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
    public sharedMethods: SharedmethodsService
  ) { 
    super(contentService)
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      // we use this to search the content by the key to load the form we need.
      this.objectTolookup = params['clause-type']; 
      // remove whitespace from beginning and end of string
      this.objectTolookup = this.objectTolookup.trim();
      this.contractId = params['contractId'];
      this.pageSetup();
    });
  }

  pageSetup(){
    const pageData = this.contentService.getContentByPropertyName(this.clauseMapping[this.objectTolookup]);
    if (!pageData) {
      this.sharedMethods.showToast(this.commonText?.somethingWentWrong)
      return;
    }
    this.pageTitle = pageData?.pageTitle;
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
    this.submitButtonText = this.pageText?.submitButtonText;
  }

  onSubmit(formData) {
    console.log(formData);
    console.log(this.contractId);
  }

}
