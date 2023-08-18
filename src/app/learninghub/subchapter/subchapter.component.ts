import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  upNextContent: any;
  nextChapterId: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public contentService: ContentService,
    public router: Router,
  ) {
    this.activatedRoute.params.subscribe(async params => {
      this.subChapterId = params?.subChapterId;
    });
  }

  ngOnInit() {
    this.subChapterContent = this.contentService.getContentByPropertyName(this.subChapterId);
    this.pageContent = this.subChapterContent?.pageContent;
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

    const data = {
      name: nextSubChapterContent?.label || '',
      description: nextSubChapterContent?.description || '',
      icon: nextSubChapterContent?.icon || this.imgUrl, // TODO: use tuna logo as default
      page: nextSubChapterContent?.page,
    };
    return nextSubChapterContent ? data : null;
  }

  handleCaseStudyClick() {}

}
