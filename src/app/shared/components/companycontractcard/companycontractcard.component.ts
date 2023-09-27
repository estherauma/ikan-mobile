import { Component, Input, OnInit } from '@angular/core';
import { ContentService } from '../../services/content/content.service';

@Component({
  selector: 'app-companycontractcard',
  templateUrl: './companycontractcard.component.html',
  styleUrls: ['./companycontractcard.component.scss'],
})
export class CompanycontractcardComponent implements OnInit {
  commonText: any;

  @Input() title = '';
  @Input() contract;
  @Input() vessel = '';
  @Input() dates = '';
  @Input() isLight = false;
  @Input() hideImage = false;

  constructor(
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
  }

  viewContract() {
    console.log(this.contract);
  }

}
