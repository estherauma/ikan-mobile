import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

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

  constructor() { }

  ngOnInit() {
  }

  //TODO: Set the pageTitle using this function for the different pages
  getPageTitle(pageData) { }

}
