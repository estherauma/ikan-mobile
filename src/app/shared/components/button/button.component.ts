import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {

  @Input() title;
  @Input() disabled = false;
  @Input() fill: 'solid' | 'clear' | 'outline' = 'solid';
  @Input() size: 'small' | 'default' | 'large' = 'default';
  @Input() shape: 'round' | 'default' = 'round';
  @Input() config: 'ikan-light' | 'ikan-deepblue' | 'ikan-light-outline' | 'yellow' | '' = '';
  @Input() class = '';
  @Input() color = 'transparent';
  @Input() iconPosition = 'left';
  @Input() iconName = '';
  @Input() type = '';

  @Output() onClick = new EventEmitter<any>();

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
    } else if (this.config === 'yellow') {
      this.finalCss = this.shape === 'round' ? 'ikan-yellow-btn rounded' : 'ikan-light-btn';
      this.customClasses = this.finalCss;
    }
    else {
      this.color = 'primary';
    }
  }

  onButtonClick() {
    this.onClick.emit();
  }

}
