import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-variant',
  templateUrl: './variant.page.html',
  styleUrls: ['./variant.page.scss'],
})
export class VariantPage implements OnInit {
  pageContent: any;
  learningHubSubChapters = [];
  chapterId: string;
  bgImgUrl = '';

  constructor(
    public router: Router,
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
    public sharedmethods: SharedmethodsService,
  ) {
    this.activatedRoute.params.subscribe(async params => {
      this.chapterId = params?.chapterId;
    });
  }

  async ngOnInit() {
    this.pageContent =  await this.contentService.getContentByPropertyName(this.chapterId);
    const clickableList = (this.pageContent?.pageContent?.find((e) => e.type === 'clickable_list'));
    const subChapters = clickableList?.list;
    this.bgImgUrl = this.sharedmethods.getChapterBackground(this.chapterId);
    this.learningHubSubChapters = subChapters?.map((subChapter) => {
      const subChapterTitle = subChapter?.label?.substring(subChapter?.label?.indexOf(' ') + 1) || '';
      return {
      name: subChapterTitle,
      description: subChapter?.description || '',
      icon: subChapter?.icon || this.bgImgUrl, // TODO: use tuna icon as default
      page: subChapter?.page,
      };
    });
  }

  viewDetials(item) {
    this.router.navigate([ 'learninghub/chapters', this.chapterId, item?.page?.uid ]);
  }
}
