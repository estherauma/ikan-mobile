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

  constructor(
    public activatedRoute: ActivatedRoute,
    public contentService: ContentService,
  ) {
    this.activatedRoute.params.subscribe(async params => {
      console.log('params.......', params);
      this.subChapterId = params?.subChapterId;
    });
  }

  ngOnInit() {
    this.subChapterContent = this.contentService.getContentByPropertyName(this.subChapterId);
    console.log('subbbbbbbcccc...........', this.subChapterContent);
    this.pageContent = this.subChapterContent?.pageContent;
    console.log('pageContent...............', this.pageContent);
  }

}
