import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-taiwaneseagent',
  templateUrl: './taiwaneseagent.page.html',
  styleUrls: ['./taiwaneseagent.page.scss'],
})
export class TaiwaneseagentPage implements OnInit {

  sLists = [
    {title: 'Work Orders'},
    {title: 'Demand Letters'},
    {title: 'Recruits'},
    {title: 'Payments'},
    {title: 'Learning Hub'}
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
