import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-audio-video-buttons',
  templateUrl: './audio-video-buttons.component.html',
  styleUrls: ['./audio-video-buttons.component.scss'],
  standalone: false,
})
export class AudioVideoButtonsComponent  implements OnInit {

  @Input() audioUrl = '';
  @Input() videoUrl = '';
  @Input() audioIconName = 'volume-high-outline'; // It should be a valid ionicon name eg play-outline, volume-high, volume-high-outline etc
  @Input() videoIconName = 'play-outline'; // It should be a valid ionicon name eg play-outline, volume-high, volume-high-outline etc
  @Input() audioCustomIcon: string;
  @Input() videoCustomIcon: string;
  @Input() audioColor = 'white';
  @Input() videoColor = 'white';
  @Input() audioBackground = '#8D4BF6';
  @Input() videoBackground = '#8D4BF6';
  
  constructor() { }

  ngOnInit() {}

}
