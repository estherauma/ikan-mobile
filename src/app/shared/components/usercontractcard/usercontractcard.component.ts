import { Component, OnInit, Input } from '@angular/core';
import { truncateChar } from 'src/app/utils';

@Component({
  selector: 'app-usercontractcard',
  templateUrl: './usercontractcard.component.html',
  styleUrls: ['./usercontractcard.component.scss'],
})
export class UsercontractcardComponent implements OnInit {
  @Input() imgUrl = '';
  @Input() title = '';
  @Input() contract = '';
  @Input() vessel = '';
  @Input() dates = '';
  @Input() isLight = false;

  constructor() { }

  ngOnInit() {}

}
