import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-progress-circle',
    templateUrl: './progress-circle.component.html',
    styleUrls: ['./progress-circle.component.scss'],
    standalone: false
})
export class ProgressCircleComponent  implements OnInit {

  outerProgressColor = '';
  innerProgressColor = 'unset';

  //TODO: change percentage
  @Input() percentage = 0;
  @Input() outerCircleBackground = 'var(--ikan_green_100)';
  @Input() innerCircleBackground = 'unset';
  @Input() outerBorderColor = '1px solid var(--ion-color-primary)';
  @Input() innerBorderColor = '1px solid var(--ion-color-primary)';
  @Input() outerProgressBackground = '#EAEDF6';
  @Input() innerProgressBackground = 'white';

  constructor() { }

  ngOnInit() {
    this.updateProgress();
  }

  updateProgress() {
    this.outerProgressColor = `conic-gradient(${this.outerCircleBackground} 0% ${this.percentage}%, ${this.outerProgressBackground} ${this.percentage}% 100%)`;
    this.innerProgressColor = `conic-gradient(${this.innerCircleBackground} 0% ${this.percentage}%, ${this.innerProgressBackground} ${this.percentage}% 100%)`;

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.percentage) {
      this.updateProgress();
    }
  }

}
