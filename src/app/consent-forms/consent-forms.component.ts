import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ContentService } from '../shared/services/content/content.service';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-consent-forms',
  templateUrl: './consent-forms.component.html',
  styleUrls: ['./consent-forms.component.scss'],
})
export class ConsentFormsComponent  implements OnInit {

  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;

  pages = [];
  showPrevBtn = false;
  audioUrl: string = '';

  constructor(
    public contentService: ContentService,
  ) { }

  async ngOnInit() {
    const pageOne = this.contentService.getContentByPropertyName('worker-consent-form-one');
    console.log('pageOne----', pageOne);
    this.pages.push(pageOne);
    const pageTwo = this.contentService.getContentByPropertyName('worker-consent-form-two');
    console.log('pageTwo----', pageTwo);
    this.pages.push(pageTwo);
  }

  goToNextSlide() {
    const swiper = this.swiperRef?.nativeElement.swiper;
    if (!swiper) { return; }
    swiper.slideNext();
    this.showPrevBtn = !!swiper.activeIndex;
  }

  goToPrevSlide() {
    const swiper = this.swiperRef?.nativeElement.swiper;
    if (!swiper) { return; }
    swiper.slidePrev();
    this.showPrevBtn = !!swiper.activeIndex;
  }

  handleSelectChange(e) {}

  handleRadioChange(event: any) {
    // page.selectedOption = event.detail.value;
  }

  playAudio(url: string) {
    this.audioUrl = url;
    const audio: HTMLAudioElement = this.audioPlayerRef.nativeElement;
    audio.play();
  }

  submitForm(){}
}
