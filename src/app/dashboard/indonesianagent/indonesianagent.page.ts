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
      data: [65, 59, 80],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
      ],
    }]
  };

  constructor() { }

  ngOnInit() {
  }

}
