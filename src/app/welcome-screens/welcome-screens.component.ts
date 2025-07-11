import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ContentService } from '../shared/services/content/content.service';
import { SharedmethodsService } from '../shared/services/sharedmethods/sharedmethods.service';
import { Router } from '@angular/router';
import { StorageKeys, UserData } from '../shared/types/api-types';
import { AuthService } from '../shared/services/auth/auth.service';

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
  user: UserData;

  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public router: Router,
    public authService: AuthService,
  ) {}

  async ngOnInit() {
    this.commonText = await this.contentService?.commonText;
    this.pageContent = await this.contentService?.getContentByPropertyName('welcome-screens');
    this.pageTitle = this.pageContent?.pageTitle;
    this.showWelcomeScreens = this.pageContent?.showSlides;
    this.slides = this.pageContent?.slides;
    this.user = await this.sharedMethods.getUserData();
  }

  onSlideChange(e) {}

  goToPreviousSlide() {
    const swiper = this.swiperRef?.nativeElement?.swiper;
    if (!swiper) { return; }
    swiper.slidePrev();
  }

  goToNextSlide() {
    const swiper = this.swiperRef?.nativeElement.swiper;
    if (!swiper) { return; }
    swiper.slideNext();
  }

  async exitWelcomeScreens() {
    await this.sharedMethods.saveDataToStorage(StorageKeys.seenWelcomeScreens, true);

    this.router.navigate([this.authService.getCurrentUserBaseUrlFromRole(this.user?.role)]);
  }

  async skipWelcomeScreens() {
    await this.sharedMethods.saveDataToStorage(StorageKeys.skippedWelcomeScreens, true);

    this.router.navigate([this.authService.getCurrentUserBaseUrlFromRole(this.user?.role)]);
  }
}
