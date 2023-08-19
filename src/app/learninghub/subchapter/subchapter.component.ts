import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-subchapter',
  templateUrl: './subchapter.component.html',
  styleUrls: ['./subchapter.component.scss'],
})
export class SubchapterComponent  implements OnInit {
  subChapterId: string;
  subChapterContent: any;
  pageContent: any = [];
  caseStudyInputs = {
    styles: 'case-study',
    icons: {
      forwardArrow: 'assets/icon/arrow-forward.svg',
      bookmarkFilled: '',
      bookmarkOutlined: '',
    }
  };
  imgUrl = ''; // TODO: use tuna icon as default
  upNextContent: any;
  nextChapterId: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public contentService: ContentService,
    public router: Router,
    public sharedmethods: SharedmethodsService,
  ) {
    this.activatedRoute.params.subscribe(async params => {
      this.subChapterId = params?.subChapterId;
    });
  }

  ngOnInit() {
    this.subChapterContent = this.contentService.getContentByPropertyName(this.subChapterId);
    this.pageContent = this.subChapterContent?.pageContent;
    const chapterId = this.subChapterId.split('.')[0];
    this.imgUrl = this.sharedmethods?.getChapterBackground(chapterId, 'subchapter');
    this.upNextContent = this.getNextChapterContent();
  }

  goToNextChapter() {
    const chapterId = this.subChapterId.split('.')[0];
    this.router.navigate([ 'learninghub/chapters', this.nextChapterId, this.upNextContent?.page?.uid ]);
  }

  getNextChapterContent() {
    let nextSubChapterContent: any;
    // current chapter
    const chapterContent = this.contentService.getContentByPropertyName(this.subChapterId.split('.')[0]);
    const chapterList = (chapterContent?.pageContent?.find((e) => e.type === 'clickable_list'))?.list;
    chapterList.sort((a, b) => a.page.uid.split('.')[1] - b.page.uid.split('.')[1]);

    if (chapterList[chapterList.length - 1]?.page?.uid !== this.subChapterId) {
      const currentIndex = chapterList.findIndex((el) => el?.page?.uid === this.subChapterId);
      nextSubChapterContent = chapterList[currentIndex + 1];
      this.nextChapterId = this.subChapterId.split('.')[0];
    } else {
      // next chapter
      const nextChapterContent = this.contentService.getContentByPropertyName(`${Number(this.subChapterId.split('.')[0]) + 1}`);
      const clickableList = nextChapterContent?.pageContent?.find((e) => e.type === 'clickable_list') || [];
      const nextChapterList = clickableList?.list || [];
      nextChapterList.sort((a, b) => a.page.uid.split('.')[1] - b.page.uid.split('.')[1]);

      nextSubChapterContent = nextChapterList[0];
      this.nextChapterId = `${Number(this.subChapterId.split('.')[0]) + 1}`;
    }

    const url = this.sharedmethods?.getChapterBackground(this.nextChapterId, 'chapter');
    const data = {
      name: nextSubChapterContent?.label || '',
      description: nextSubChapterContent?.description || '',
      icon: nextSubChapterContent?.icon || url, // TODO: use tuna logo as default
      page: nextSubChapterContent?.page,
    };
    return nextSubChapterContent ? data : null;
  }

  handleCaseStudyClick() {}

}
