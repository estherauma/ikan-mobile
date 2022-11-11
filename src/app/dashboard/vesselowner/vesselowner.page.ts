import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vesselowner',
  templateUrl: './vesselowner.page.html',
  styleUrls: ['./vesselowner.page.scss'],
})
export class VesselownerPage implements OnInit {

  sLists = [
    {title: 'Work Orders'},
    {title: 'Vessels'},
    {title: 'Agents'},
    {title: 'Recruits'},
    {title: 'Contracts'},
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
