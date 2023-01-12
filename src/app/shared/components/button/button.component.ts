import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() onClick;
  @Input() title;
  @Input() disabled = false;
  @Input() fill: 'solid' | 'clear' | 'outline' = 'solid';
  @Input() size: 'small' | 'default' | 'large' = 'default';
  @Input() shape: 'round' | 'default' = 'round';
  @Input() config: 'ikan-light' | 'ikan-deepblue' | 'ikan-light-outline' | '' = '';
  @Input() class = '';
  @Input() color = 'transparent';
  @Input() iconPosition = 'left';
  @Input() iconName = 'add-outline';

  customClasses = '';
  finalCss = '';
  height = '';
  constructor() { }

  ngOnInit() {
    if (this.config === 'ikan-light') {
      this.finalCss = this.shape === 'round' ? 'ikan-light-btn rounded' : 'ikan-light-btn';
      this.customClasses = this.finalCss;
    } else if (this.config === 'ikan-deepblue') {
      this.finalCss = this.shape === 'round' ? 'ikan-deepblue-btn rounded' : 'ikan-light-btn';
      this.customClasses = this.finalCss;
    } else if (this.config === 'ikan-light-outline') {
      this.fill = 'outline';
      this.color = 'light';
    } else {
      this.color = 'primary';
    }
  }

}
