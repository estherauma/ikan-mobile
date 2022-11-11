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
      data: [65, 59, 80],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
      ],
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
      data: [65, 59, 80],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
      ],
      borderWidth: 1
    }],
    labels: ['one', 'two', 'three'],
    chartHeight: 400
  };

  constructor() { }


  ngOnInit() {
  }

}
