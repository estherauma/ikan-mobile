import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ContentService } from '../shared/services/content/content.service';
import { SharedmethodsService } from '../shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-welcome-screens',
  templateUrl: './welcome-screens.component.html',
  styleUrls: ['./welcome-screens.component.scss'],
})
export class WelcomeScreensComponent  implements OnInit {

  pageTitle: string;
  pageContent: any;
  showWelcomeScreens: false;
  slides = [];
  commonText: any;
  theme = '';

  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
  ) {}

  async ngOnInit() {
    this.commonText = await this.contentService?.commonText;
    this.pageContent = await this.contentService?.getContentByPropertyName('welcome-screens');
    this.pageTitle = this.pageContent?.pageTitle;
    this.showWelcomeScreens = this.pageContent?.showSlides;
    this.slides = this.pageContent?.slides;
  }

  onSlideChange(e) {}
}
