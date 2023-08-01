import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-subchapter',
  templateUrl: './subchapter.component.html',
  styleUrls: ['./subchapter.component.scss'],
})
export class SubchapterComponent  implements OnInit {
  subChapterId: string;
  subChapterContent: any;
  pageContent: any = [];
  caseStudyInputs: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public contentService: ContentService,
  ) {
    this.activatedRoute.params.subscribe(async params => {
      this.subChapterId = params?.subChapterId;
    });
  }

  ngOnInit() {
    this.subChapterContent = this.contentService.getContentByPropertyName(this.subChapterId);
    this.pageContent = this.subChapterContent?.pageContent;
  }

  handleCaseStudyClick() {}

}
