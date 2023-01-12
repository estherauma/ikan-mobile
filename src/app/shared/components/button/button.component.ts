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
  @Input() size: 'small' | 'xs' | 'large' = 'large';
  @Input() shape: 'round' | 'default'  = 'round';
  @Input() config: 'ikan-light' | 'ikan-deepblue' | 'ikan-light-outline' | '' = '';
  @Input() class = '';
  @Input() color = 'transparent';

  customClasses='';
  finalCss='';
  height='';
  constructor() { }

  ngOnInit() {
    if(this.size === 'xs'){
      this.height = '60px';
    }else if(this.size === 'small'){
      this.height = '39px';
    }else{
      this.height = '60px';
    }

    if(this.config === 'ikan-light'){
      this.finalCss = this.shape === 'round' ? 'ikan-light-btn rounded' : 'ikan-light-btn';
      this.customClasses = this.finalCss;
    }else if(this.config === 'ikan-deepblue'){
        this.finalCss = this.shape === 'round' ? 'ikan-deepblue-btn rounded' : 'ikan-light-btn';
        this.customClasses = this.finalCss;
    }else if(this.config === 'ikan-light-outline'){
      this.fill = 'outline';
      this.color = 'light';
    }else{
      this.color = 'primary';
    }
  }

}
