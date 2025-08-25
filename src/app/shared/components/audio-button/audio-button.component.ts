import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-audio-button',
    templateUrl: './audio-button.component.html',
    styleUrls: ['./audio-button.component.scss'],
    standalone: false
})
export class AudioButtonComponent  implements OnInit {

  audio: HTMLAudioElement;
  isPlaying = false;

  @Input() url = '';
  @Input() iconName = 'volume-high-outline'; // It should be a valid ionicon name eg play-outline, volume-high, volume-high-outline etc
  @Input() customIcon: string;
  @Input() color = 'white';
  @Input() background = '#8D4BF6';

  @ViewChild('audioPlayer', { static: false })
  audioPlayerRef!: ElementRef<HTMLAudioElement>;

  private routeSub!: Subscription;

  constructor(
    private router: Router,
  ) {
    this.routeSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.stopAudio();
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.stopAudio();
  }


  toggleAudio() {
    const audio = this.audioPlayerRef.nativeElement;
    if (this.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  stopAudio() {
    const audio = this.audioPlayerRef?.nativeElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    this.isPlaying = false;
  }
}
