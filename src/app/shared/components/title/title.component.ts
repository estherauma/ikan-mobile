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
  constructor() { }

  ngOnInit() {}

}
