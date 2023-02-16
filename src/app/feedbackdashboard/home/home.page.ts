import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pageTitle = 'Feedback Dashboard';
  // new
  trainingFeedback = {
    chartType: 'bar',
    title: 'Training',
    icon: '/assets/icon/training_white.svg',
    datasets: [{
      label: '',
      data: [20, 50, 80],
      backgroundColor: [
        '#80D8FE',
        '#3565FF',
        '#80D8FE'
      ]
    }],
    labels: ['one', 'two', 'three'],
    chartHeight: 400,
    data: {
      title: 'Training',
      stat: {
        mainTitle: 'Training Completion',
        statPercentage: '62%',
        breakDowns: ['77%: Core training', '20%: Additional learning', '3%: Not completed']
      }
    }
  };

  paymentsFeedback = {
    chartType: 'bar',
    title: 'Training',
    icon: '/assets/icon/payments_white.svg',
    datasets: [{
      label: '',
      data: [20, 50, 80],
      backgroundColor: [
        '#80D8FE',
        '#3565FF',
        '#80D8FE'
      ]
    }],
    labels: ['one', 'two', 'three'],
    chartHeight: 400,
    data: {
      title: 'Payments',
      stat: {
        mainTitle: 'Training Completion',
        statPercentage: '62%',
        breakDowns: ['77%: Received per contract', '20%: Contract discrepancy', '3%: Not received']
      }
    }
  };

  conditionsFeedback = {
    chartType: 'doughnut',
    title: 'Conditions',
    icon: '/assets/icon/worker_conditions_white.svg',
    datasets: [{
      label: '',
      data: [20, 50, 80],
      backgroundColor: [
        '#80D8FE',
        '#3565FF',
        '#80D8FE'
      ]
    }],
    labels: [],
    chartHeight: 400,
    data: {
      title: 'Conditions',
      stat: {
        mainTitle: 'Overall conditions',
        statPercentage: '62%',
        breakDowns: ['77%: Issues resolved', '20%: Positive experience', '3%: Issues raised, not resolved']
      }
    }
  };

  workingHoursFeedback = {
    chartType: 'doughnut',
    title: 'Working hours',
    icon: '/assets/icon/clock_white.svg',
    datasets: [{
      label: '',
      data: [20, 50, 80],
      backgroundColor: [
        '#80D8FE',
        '#3565FF',
        '#80D8FE'
      ]
    }],
    labels: [],
    chartHeight: 400,
    data: {
      title: 'Working hours',
      stat: {
        mainTitle: ' As per contract',
        statPercentage: '62%',
        breakDowns: ['77%: As per contract', '20%: Paid overtime', '3%: Unpaid overtime']
      }
    }
  };

  workerTrainingFeedback = {
    chartType: 'bar',
    title: 'Worker training',
    icon: '/assets/icon/training_white.svg',
    datasets: [{
      label: '',
      data: [20, 50, 80],
      backgroundColor: [
        '#80D8FE',
        '#3565FF',
        '#80D8FE'
      ]
    }],
    labels: ['one', 'two', 'three'],
    chartHeight: 400,
    data: {
      title: 'Worker training',
      stat: {
        mainTitle: 'Training Completion',
        statPercentage: '62%',
        breakDowns: ['77%: Core training', '20%: Additional learning', '3%: Not completed']
      }
    }
  };

  workerFeedback = {
    chartType: 'doughnut',
    title: 'Worker feedback',
    icon: '/assets/icon/training_white.svg',
    datasets: [{
      label: '',
      data: [20, 50, 80],
      backgroundColor: [
        '#80D8FE',
        '#3565FF',
        '#80D8FE'
      ]
    }],
    labels: [],
    chartHeight: 400,
    data: {
      title: 'Worker feedback',
      stat: {
        mainTitle: 'Over satisfaction',
        statPercentage: '41%',
        breakDowns: ['77%: Received per contract', '20%: Contract discrepancy', '3%: Not received']
      }
    }
  };

  constructor() { }


  ngOnInit() {
  }

}
