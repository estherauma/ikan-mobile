import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss'],
})
export class ChapterComponent  implements OnInit {
  pageContent: any;
  learningHubSubChapters = [];
  chapterId: string;
  bgImgUrl = '';

  constructor(
    public router: Router,
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
    public sharedmethods: SharedmethodsService,
    public analytics: AnalyticsService
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
    if (this.pageContent.analyticsEventName) {
      this.analytics.trackEvent(this.pageContent.analyticsEventName, this.sharedmethods.analyticsEventParams);
    } else {
      console.log('No analytics event name found for this page')
    }
  }

  viewDetails(item) {
    this.router.navigate([ 'learninghub/chapters', this.chapterId, item?.page?.uid ]);
  }
}
