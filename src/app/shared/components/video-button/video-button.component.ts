import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-video-button',
    templateUrl: './video-button.component.html',
    styleUrls: ['./video-button.component.scss'],
    standalone: false
})
export class VideoButtonComponent  implements OnInit {

  showVideo = false;
  isPlaying = false;
  commonText: any;

  @Input() url = '';
  @Input() iconName = 'play-outline'; // It should be a valid ionicon name eg play, volume-high, volume-high-outline etc
  @Input() customIcon: string;
  @Input() color = 'white';
  @Input() background = '#8D4BF6';

  @ViewChild('videoPlayer', { static: false })
  videoPlayerRef!: ElementRef<HTMLVideoElement>;

  private routeSub!: Subscription;

  constructor(
    private contentService: ContentService,
    private router: Router,
  ) {
    this.routeSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.closeVideo();
      }
    });
  }

  async ngOnInit() {
    this.commonText = await this.contentService.commonText;
  }

  ngAfterViewInit() {
    const video = this.videoPlayerRef?.nativeElement;
    if (video) {
      video.load();
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.closeVideo();
  }

  playVideo() {
    this.showVideo = true;
    this.isPlaying = true;
    setTimeout(() => {
      this.videoPlayerRef?.nativeElement.play();
    }, 0);
  }

  closeVideo() {
    const video = this.videoPlayerRef?.nativeElement;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    this.showVideo = false;
    this.isPlaying = false;
  }
}
