import { Component, Input, OnInit } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-companycontractcard',
    templateUrl: './companycontractcard.component.html',
    styleUrls: ['./companycontractcard.component.scss'],
    standalone: false
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
    public router: Router,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
  }

  viewContract() {
    this.contract.file = JSON.stringify(this.contract.file);
    const queryParams =  this.contract;
    this.router.navigate(['/contracts/view', queryParams]);
  }

}
