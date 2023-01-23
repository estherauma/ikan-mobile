import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pageTitle = 'Feedback Dashboard';
  dataset = {
    chartType: 'doughnut',
    title: 'Vessels',
    datasets: [{
      label: 'Bar chart',
      data: [65, 59, 80]
    }]
  };

  vercelStats = this.dataset;
  recrutersData = this.dataset;
  paymentsData = this.dataset;
  trainingData = {
    chartType: 'bar',
    title: 'Training',
    datasets: [{
      label: 'My First Dataset',
      data: [20, 50, 80]
    }],
    labels: ['one', 'two', 'three'],
    chartHeight: 400
  };

  paymentsDataMix = {
    chartType: 'doughnut',
    title: 'Vessels',
    datasets: [{
      label: 'Bar chart',
      data: [20, 40, 60, 80],
      backgroundColor: [
        '#F4992D',
        '#F0525C',
        '#D3DAEE',
        '#74F080'
      ]
    }]
  };

  constructor() { }


  ngOnInit() {
  }

}
