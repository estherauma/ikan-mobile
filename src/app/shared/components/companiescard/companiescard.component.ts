import { Component, OnInit, Input } from '@angular/core';
import { ContentService } from '../../services/content/content.service';

@Component({
  selector: 'app-companiescard',
  templateUrl: './companiescard.component.html',
  styleUrls: ['./companiescard.component.scss'],
})
export class CompaniescardComponent implements OnInit {
  commonText;
  status: string;
  country: string;

  @Input() company;

  constructor(
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService.commonText;
    this.status = this.contentService.getFormOptionTranslation('company-create', 'status', this.company?.status);
    this.country = this.contentService.getFormOptionTranslation('company-create', 'country', this.company?.country);
  }
}
