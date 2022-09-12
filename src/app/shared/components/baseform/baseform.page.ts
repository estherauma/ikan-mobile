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

  constructor() { }

  ngOnInit() {
  }

}
