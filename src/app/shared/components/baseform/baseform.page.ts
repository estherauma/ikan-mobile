import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ContentService } from '../../services/content/content.service';

@Component({
    selector: 'app-baseform',
    templateUrl: './baseform.page.html',
    styleUrls: ['./baseform.page.scss'],
    standalone: false
})
export class BaseformPage implements OnInit {
  commonText: any;
  pageCommonText: any;
  pageFormGroup: FormGroup = new FormGroup({});
  formQuestions = [ ];
  group: any =  {};
  pageTitle: string = '';
  submitButtonText: string = '';
  pageText: any;

  constructor(
    public contentService: ContentService
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.pageFormGroup = new FormGroup(this.group);
    this.submitButtonText = this.contentService.commonText?.create;
  }

}
