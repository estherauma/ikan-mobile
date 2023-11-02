import { Component, Input, OnInit } from '@angular/core';
import { ProgressBarType } from '../progressbar/progressbar.component';

@Component({
  selector: 'app-maincard',
  templateUrl: './maincard.component.html',
  styleUrls: ['./maincard.component.scss'],
})
export class MaincardComponent implements OnInit {
  @Input() cardTitleSize: 'small' | 'big' | '' = '';
  @Input() text = '';
  @Input() title = '';
  @Input() imageUrl = '';
  @Input() imageShape: 'rounded' | 'circle';
  @Input() imagePosition: 'left' | 'top' = 'left';
  @Input() imageSize: 'small' | 'big' = 'big';
  @Input() progressBarValue = '';
  @Input() progressText = '';
  @Input() progressBarType: ProgressBarType | string = 'warning';
  constructor() { }

  ngOnInit() {}

}
