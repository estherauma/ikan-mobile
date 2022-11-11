import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboardelcomesection',
  templateUrl: './dashboardelcomesection.component.html',
  styleUrls: ['./dashboardelcomesection.component.scss'],
})
export class DashboardelcomesectionComponent implements OnInit {

  @Input() name: string;
  @Input() message: string;
  @Input() link: string;

  constructor() { }

  ngOnInit() {}

}
