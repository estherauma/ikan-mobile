import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-workordercard',
  templateUrl: './workordercard.component.html',
  styleUrls: ['./workordercard.component.scss'],
})
export class WorkordercardComponent implements OnInit {
  @Input() wo;
  constructor() { }

  ngOnInit() {}

}
