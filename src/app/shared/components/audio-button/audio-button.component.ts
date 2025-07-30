import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-audio-button',
  templateUrl: './audio-button.component.html',
  styleUrls: ['./audio-button.component.scss'],
})
export class AudioButtonComponent  implements OnInit {

  audio: HTMLAudioElement;
  isPlaying = false;

  @Input() url = '';
  @Input() iconName = 'volume-high-outline'; // It should be a valid ionicon name eg play-outline, volume-high, volume-high-outline etc
  @Input() customIcon: string;
  @Input() color = 'white';
  @Input() background = 'var(--ion-color-primary)';

  @ViewChild('audioPlayer', { static: false })
  audioPlayerRef!: ElementRef<HTMLAudioElement>;

  constructor() { }

  ngOnInit() {}

  toggleAudio() {
    const audio = this.audioPlayerRef.nativeElement;

    if (this.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    this.isPlaying = !this.isPlaying;
  }
}
