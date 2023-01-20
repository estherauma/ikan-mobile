import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-indonesianagent',
  templateUrl: './indonesianagent.page.html',
  styleUrls: ['./indonesianagent.page.scss'],
})
export class IndonesianagentPage implements OnInit {

  sLists = [
    {title: 'Demand Letters'},
    {title: 'Recruits'},
    {title: 'Payments'}
  ];

  performanceData = {
    chartType: 'doughnut',
    title: 'Overall performace',
    datasets: [{
      label: '',
      data: [65, 59, 80]
    }]
  };

  constructor() { }

  ngOnInit() {
  }

}
