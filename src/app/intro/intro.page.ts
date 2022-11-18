import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { ContentService } from '../shared/services/content/content.service';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IntroPage implements OnInit {

  @ViewChild('intro', { static: false }) intro: SwiperComponent | undefined;

  slides;

  constructor(
    public router: Router,
    public contentService: ContentService
  ) {

    const pageData = this.contentService.getContentByPropertyName('introcontent');
    this.slides = pageData?.data;

  }

  ngOnInit() {
  }


  onBack() {
    this.intro.swiperRef.slidePrev();
  }

  onNext() {
    this.intro.swiperRef.slideNext();
  }

  onSkip() {
    this.router.navigate(['/workorders/home']);
  }

  onFinished() {
    this.router.navigate(['/workorders/home']);
  }

}
