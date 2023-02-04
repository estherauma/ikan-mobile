import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-workercard',
  templateUrl: './workercard.component.html',
  styleUrls: ['./workercard.component.scss'],
})
export class WorkercardComponent implements OnInit {
  @Input() worker;
  constructor() { }

  ngOnInit() {}

}
