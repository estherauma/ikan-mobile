import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';

export type Segment = 'essentials' | 'myfiles';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  commonText: any;
  pageTitle: string = 'Documents';
  activeSegment: Segment = 'essentials';

  constructor(
    public router: Router,
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.pageTitle = this.commonText?.documents;
  }

  onSegmentChange(e) {
    this.activeSegment = e?.detail?.value;
  }
}
