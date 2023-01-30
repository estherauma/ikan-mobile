import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-placementoffercard',
  templateUrl: './placementoffercard.component.html',
  styleUrls: ['./placementoffercard.component.scss'],
})
export class PlacementoffercardComponent implements OnInit {
  @Input() title = 'Section title';
  @Input() details = 'Here’s a little bit of additional information';
  @Input() isFirst = false;
  @Input() isLast = false;
  @Input() noMargin = false;
  constructor() { }

  ngOnInit() {}

}
