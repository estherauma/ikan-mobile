import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.page.html',
  styleUrls: ['./buyer.page.scss'],
})
export class BuyerPage implements OnInit {

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

  dashboardStats =  Array(5).fill({
    chartType: 'doughnut',
    title: 'Stats title',
    datasets: [{
      label: '',
      data: [65, 59, 80],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
      ],
    }]
  });

  constructor() { }

  ngOnInit() {
  }

}
