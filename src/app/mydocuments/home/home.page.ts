import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

export type Segment = 'essentials' | 'myfiles';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  commonText: any;
  docsCommonText: any;
  pageTitle: string = 'Documents';
  activeSegment: Segment = 'essentials';

  constructor(
    public router: Router,
    public contentService: ContentService,
    private sharedMethods: SharedmethodsService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.pageTitle = this.commonText?.documents;
    const docsPageData = this.contentService.getContentByPropertyName('my-documents-common-text');
    this.docsCommonText = this.sharedMethods.convertAdditionalTextToObj(docsPageData?.additionalText);
  }

  onSegmentChange(e) {
    this.activeSegment = e?.detail?.value;
  }
}
