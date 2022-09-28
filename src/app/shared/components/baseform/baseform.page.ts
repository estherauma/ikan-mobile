import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ContentService } from '../../services/content/content.service';

@Component({
  selector: 'app-baseform',
  templateUrl: './baseform.page.html',
  styleUrls: ['./baseform.page.scss'],
})
export class BaseformPage implements OnInit {
  pageFormGroup: FormGroup;
  formQuestions = [ ];
  group =  { };
  pageTitle: string;
  submitButtonText: string;

  constructor( public contentService: ContentService) { }

  ngOnInit() {
    this.submitButtonText = this.contentService.commonText?.login;
  }

  //TODO: Set the pageTitle using this function for the different pages
  getPageTitle(pageData) { }

}
