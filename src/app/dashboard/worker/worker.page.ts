import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.page.html',
  styleUrls: ['./worker.page.scss'],
})
export class WorkerPage implements OnInit {

  sLists = [
    {title: 'Placement'},
    {title: 'My Document'},
    {title: 'To Do'},
    {title: 'Training'},
    {title: 'Payments'},
  ];

  constructor() { }

  ngOnInit() {
  }

}
