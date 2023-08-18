import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.page.html',
  styleUrls: ['./docs.page.scss'],
})
export class DocsPage implements OnInit {
  commonText: any;
  documentation: any;
  constructor(
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.documentation = [
      {
        label: this.commonText?.passport,
        checked: true,
        showReminderButton: false
      },
      {
        label: this.commonText?.visa,
        checked: false,
        showReminderButton: true
      },
      {
        label: this.commonText?.employmentAgreementSigned,
        checked: false,
        showReminderButton: true
      },
    ];
  }

}
