import { Component, OnInit, Input } from '@angular/core';
import { truncateChar } from 'src/app/utils';

@Component({
  selector: 'app-usercontractcard',
  templateUrl: './usercontractcard.component.html',
  styleUrls: ['./usercontractcard.component.scss'],
})
export class UsercontractcardComponent implements OnInit {
  @Input() imgUrl = 'assets/imgs/vessel.jpeg';
  @Input() title = truncateChar('title');
  @Input() appRef = truncateChar('appRef');
  @Input() dateOpened = truncateChar('dateOpened dateOpened');
  @Input() status = 'status';
  @Input() isLight = false;

  constructor() { }

  ngOnInit() {}

}
