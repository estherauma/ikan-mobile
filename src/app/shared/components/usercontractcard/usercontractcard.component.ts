import { Component, OnInit, Input } from '@angular/core';
import { truncateChar } from 'src/app/utils';

@Component({
  selector: 'app-usercontractcard',
  templateUrl: './usercontractcard.component.html',
  styleUrls: ['./usercontractcard.component.scss'],
})
export class UsercontractcardComponent implements OnInit {
  @Input() imgUrl = 'https://picsum.photos/200/300';
  @Input() title = '';
  @Input() contract = '';
  @Input() vessel = '';
  @Input() dates = '';
  @Input() isLight = false;
  @Input() hideImage = false;

  constructor() {}

  ngOnInit() {}

}
