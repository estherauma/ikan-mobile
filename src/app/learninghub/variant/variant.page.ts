import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-variant',
  templateUrl: './variant.page.html',
  styleUrls: ['./variant.page.scss'],
})
export class VariantPage implements OnInit {
  pageContent: any;
  learningHubSubChapters = [];
  chapterId: string;

  imgUrl = 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg'; // TODO: change this

  constructor(
    public router: Router,
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe(async params => {
      this.chapterId = params?.chapterId;
    });
  }

  async ngOnInit() {
    this.pageContent =  await this.contentService.getContentByPropertyName(this.chapterId);
    const clickableList = (this.pageContent?.pageContent?.find((e) => e.type === 'clickable_list'));
    const subChapters = clickableList?.list;
    this.learningHubSubChapters = subChapters?.map((subChapter) => {
      const subChapterTitle = subChapter?.label?.substring(subChapter?.label?.indexOf(' ') + 1) || '';
      return {
      name: subChapterTitle,
      description: subChapter?.description || '',
      icon: subChapter?.icon || this.imgUrl, // TODO: use tuna icon as default
      page: subChapter?.page,
      };
    });
  }

  viewDetials(item) {
    this.router.navigate([ 'learninghub/chapters', this.chapterId, item?.page?.uid ]);
  }
}
