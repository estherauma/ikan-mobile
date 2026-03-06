import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-subtopic',
  templateUrl: './subtopic.component.html',
  styleUrls: ['./subtopic.component.scss'],
  standalone: false,
})
export class SubtopicComponent  implements OnInit {

  pageContent: any[] = [];
  networkStatus = false;
  bgImgUrl = '';
  caseStudyInputs = {
    styles: 'case-study',
    icons: {
      forwardArrow: 'assets/icon/arrow-forward.svg',
      bookmarkFilled: '',
      bookmarkOutlined: '',
    }
  };

  constructor(
    public activatedRoute: ActivatedRoute,
    public sharedmethods: SharedmethodsService,
    public router: Router
  ) {
    this.activatedRoute.params.subscribe(async params => {
      if (params?.subTopicData) {
        const subTopicData = JSON.parse(params?.subTopicData);
        this.pageContent = subTopicData?.pageContent;
        this.bgImgUrl = subTopicData?.bgImgUrl;
      }
      
    });
  }

  async ngOnInit() {
    this.networkStatus = await this.sharedmethods.checkInternetConnectionStatus();
  }

  handleCaseStudyClick(data) {
    const params = {
      subChapterId: data?.subChapter,
      caseStudyUid: data?.uid,
      isCaseStudy: true,
      imgUrl: data?.image?.url || '',
      ...data
    };
    this.router.navigate([ 'learninghub/case-studies', data?.uid, params ]);
  }

  onPlay(e) {}
}
