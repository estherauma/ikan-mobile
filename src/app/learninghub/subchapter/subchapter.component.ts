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
  imgUrl = 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg';

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
