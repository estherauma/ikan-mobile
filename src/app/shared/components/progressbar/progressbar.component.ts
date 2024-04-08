import { Component, Input, OnInit } from '@angular/core';


export type ProgressBarType = 'warning' | 'success' | 'primary';
@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss'],
})
export class ProgressbarComponent implements OnInit {
  @Input() value = '100';
  @Input() type: ProgressBarType | string = 'success';
  @Input() title = '';
  @Input() titleColor: 'blue' | 'dark-blue' = 'blue';
  progressValue = 0;
  constructor() { }

  ngOnInit() {
    this.progressValue = parseInt(this.value, 10)/100;
  }

}
