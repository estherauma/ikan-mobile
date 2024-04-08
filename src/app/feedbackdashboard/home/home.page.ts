import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { Content } from 'src/app/shared/types/api-types';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pageTitle = 'Feedback Dashboard';
  // new
  trainingFeedback: any;
  paymentsFeedback: any;
  conditionsFeedback: any;

  

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

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService

  ) {
    let commonText = this.contentService.getCommonText();
    

  }


  ngOnInit() {
    this.trainingFeedback = {
      chartType: 'bar',
      title: 'Training',
      icon: '/assets/icon/training_white.svg',
      datasets: [{
        label: '',
        data: [3, 20, 77],
        backgroundColor: [
          '#80D8FE',
          '#3565FF',
          '#80D8FE',
        ]
      }],
      labels: ['one', 'two', 'three'],
      chartHeight: 400,
      data: {
        title: this.contentService.commonText?.fdbkTraining,
        stat: {
          mainTitle: this.contentService.commonText?.fdbkTrainingCompletion,
          statPercentage: '62%',
          breakDowns: [
            this.contentService.commonText?.fdbckNotCompleted,
            this.contentService.commonText?.fdbckAdditionalLearning,
            this.contentService.commonText?.fdbckCoreTraining,
          ]
        }
      }
    };

    
    this.paymentsFeedback = {
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
        title: this.contentService.commonText?.fdbckPayments,
        stat: {
          mainTitle: this.contentService.commonText?.fdbckPaymentsCompletion,
          statPercentage: '62%',
          breakDowns: [
            this.contentService.commonText?. fdbckPaymentReceivedContract,
            this.contentService.commonText?.fdbckPaymentContractDiscrepancy,
            this.contentService.commonText?.fdbckPaymentNotReceived,
          ]
        }
      }
    };

    this.conditionsFeedback = {
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
        // title: 'Conditions',
        title: this.contentService.commonText?.fdbckConditions,
        stat: {
          // mainTitle: 'Overall conditions',
          mainTitle: this.contentService.commonText?.fdbckOverallConditions,
          // statPercentage: '62%',
          statPercentage: this.contentService.commonText?.fdbckOverallConditionsPercentage,
          breakDowns: [
            // '77%: Issues resolved',
            // '20%: Positive experience', 
            // '3%: Issues raised, not resolved'
            this.contentService.commonText?.fdbckIssuesResolved,
            this.contentService.commonText?.fdbckPositiveExperience,
            this.contentService.commonText?.fdbckIssuesRaisedNotResolved
          ]
        }
      }
    };

   this.pageTitle = this.contentService.commonText?.fdbckTitle;
  }

}
