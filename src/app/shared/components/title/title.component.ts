import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
})
export class TitleComponent implements OnInit {
 @Input() title = '';
 @Input() subScript: string | number  = '';
 @Input() color = '';
 @Input() type: 'blue' | '' = '';
 @Input() isBlue = false;
 @Input() isSmall = false;
 @Input() isBig = false;
 @Input() isLightBlue = false;
 @Input() variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'generic' = 'generic';
  constructor() { }

  ngOnInit() {}

}
