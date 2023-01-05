import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ConfirmedmodalComponent } from 'src/app/shared/components/confirmedmodal/confirmedmodal.component';
import { ConfirmmodalComponent } from 'src/app/shared/components/confirmmodal/confirmmodal.component';

@Component({
  selector: 'app-training',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  searchAndFilterDataSet = [
    {
      title: 'Pre-departure',
      questions: [
        { title: 'Question Time!', passed: true },
        { title: 'Question Time!', passed: false }
      ],
    },
    {
      title: 'During Employment',
      questions: [
        { title: 'Question Time!', passed: true },
        { title: 'Question Time!', passed: false },
        { title: 'Question Time!', passed: true }
      ],
    },
    {
      title: 'Post Employment',
      questions: [
        { title: 'Question Time!', passed: true },
        { title: 'Question Time!', passed: false },
        { title: 'Question Time!', passed: true }
      ],
    },
  ];
  trainings = [...this.searchAndFilterDataSet];
  filterOptions = [
    { title: 'passed', value: 'closed' }
  ];
  datasets = [{
    label: '',
    data: [65, 59, 80],
    backgroundColor: [
      'rgba(255, 99, 132, 0.5)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
    ],
  }];
  constructor(
    public router: Router,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  filterResult(result) { }
  searchResult(result) { }

  toTrainingStatus() {
    this.router.navigate(['/workers/status']);
  }

  async onQuestionClick() {
    const confirmModal = await this.modalCtrl.create({
      component: ConfirmmodalComponent,
      componentProps: {
        title: 'Question?',
        actionByRadio: true,
        description: 'If user is not sure of the answer we can go to the section containing the relevant information',
        link: '/'
      },
      cssClass: 'tuna-modal'
    });

    confirmModal.present();
    confirmModal.onDidDismiss().then(async ({ data }) => {
      let componentProps;

      if (data === 'yes') {
        componentProps = {
          title: 'Correct',
          msg: 'Well done message.',
          status: 'success',
          btnTitle: 'Close'
        };
      } else {
        componentProps = {
          title: 'Incorrect',
          status: 'failed',
          msg: 'If user is not sure of the answer we can go to the section containing the relevant information',
          btnTitle: 'Back'
        };
      }

      const confirmedModal = await this.modalCtrl.create({
        component: ConfirmedmodalComponent,
        cssClass: 'tuna-modal',
        componentProps,
      });
      confirmedModal.present();
      confirmedModal.onDidDismiss().then((confirmedData) => {
        //TODO: handle confirmed data
      });
    });
  }

}
