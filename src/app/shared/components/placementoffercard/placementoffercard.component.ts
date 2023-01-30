import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-placementoffercard',
  templateUrl: './placementoffercard.component.html',
  styleUrls: ['./placementoffercard.component.scss'],
})
export class PlacementoffercardComponent implements OnInit {
  @Input() title = '';
  @Input() details = '';
  @Input() isFirst = false;
  @Input() isLast = false;
  @Input() noMargin = false;
  constructor() { }

  ngOnInit() {}

}
