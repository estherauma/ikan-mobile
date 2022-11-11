import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IntroPage implements OnInit {

  @ViewChild('intro', { static: false }) intro: SwiperComponent | undefined;

  slides = Array(4).fill({
    title: 'Slide title',
    description: 'Next screen feugiat id volutpat eu, laoreet ac orci. Phasellus sodales feugiat luctus. '
  });

  constructor(
    public router: Router
  ) { }

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
