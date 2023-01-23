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
      data: [65, 59, 80]
    }]
  };

  dashboardStats =  Array(5).fill({
    chartType: 'doughnut',
    title: 'Stats title',
    datasets: [{
      label: '',
      data: [65, 59, 80]
    }]
  });

  constructor() { }

  ngOnInit() {
  }

  generateNewReport() {}

}
