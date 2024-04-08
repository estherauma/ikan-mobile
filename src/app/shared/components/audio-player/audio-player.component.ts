import { Component, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent {
  @ViewChild('audioPlayer') audioPlayer: ElementRef;

  @Input() variant: 'white-bg-title-photo' | 'white-bg-title' | 'white-bg' | 'gray-bg' | '' = '';
  @Input() title = '';
  @Input() audioSrc = '';
  @Input() size: 'thin' | '' = '';

  audioTitle = 'Your Audio Title';
  currentTime = '00:00';
  duration = '00:00';
  progress = 0;
  isMuted = false;
  playing = false;

  ngAfterViewInit() {
    this.audioPlayer.nativeElement.onloadedmetadata = () => {
      this.duration = this.formatTime(this.audioPlayer.nativeElement.duration);
    };

    this.audioPlayer.nativeElement.ontimeupdate = () => {
      this.currentTime = this.formatTime(this.audioPlayer.nativeElement.currentTime);
      this.progress = this.audioPlayer.nativeElement.currentTime / this.audioPlayer.nativeElement.duration;
    };
  }

  playAudio() {
    this.audioPlayer.nativeElement.play();
    this.playing = true;
  }

  pauseAudio() {
    this.audioPlayer.nativeElement.pause();
    this.playing = false;
  }

  muteAudio() {
    this.audioPlayer.nativeElement.muted = true;
    this.isMuted = true;
  }

  unmuteAudio() {
    this.audioPlayer.nativeElement.muted = false;
    this.isMuted = false;
  }

  private formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
