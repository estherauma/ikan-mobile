import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-feedback-stat-card',
    templateUrl: './feedback-stat-card.component.html',
    styleUrls: ['./feedback-stat-card.component.scss'],
    standalone: false
})
export class FeedbackStatCardComponent implements OnInit {
 @Input() dataset;
 @Input() isIconSection = true;
 @Input() isNoBg = false;
 @Input() isNoBorder = false;
 @Input() isActionBtn = true;
 @Input() centerIcon = '';
 @Input() isChartsCustomBgColors = false;
  constructor() { }

  ngOnInit() {}

}
