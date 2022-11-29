import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreatePage } from '../create/create.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pageTitle = 'Workers';
  workers = [
    {
      name: 'Name Surname',
      nationality: 'Indonesian',
      dob: 'xx.xx.xxxx',
      trainingStatus: 'started',
      image: ''
    },
    {
      name: 'Name Surname',
      nationality: 'Indonesian',
      dob: 'xx.xx.xxxx',
      trainingStatus: 'started',
      image: ''
    },
    {
      name: 'Name Surname',
      nationality: 'Indonesian',
      dob: 'xx.xx.xxxx',
      trainingStatus: 'started',
      image: ''
    }
  ];

  constructor(
    public router: Router,
    public modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  viewDetails(worker) {
    this.router.navigate(['workers/details', worker]);
  }

  async createWorker(){
    const modal = await this.modalCtrl.create({
      component: CreatePage,
      cssClass: 'tuna-modal',

    });
    modal.present();

    modal.onDidDismiss().then((data) => {});
  }
}
