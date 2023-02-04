import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UserRole } from 'src/app/shared/types/api-types';
import { CreatePage } from '../create/create.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pageTitle = 'Recruits';
  workerCount = 0;
  workers = [
    {
      name: 'Name Surname',
      nationality: 'Indonesian',
      dob: 'xx.xx.xxxx',
      trainingStatus: 'started',
      image: '',
      role: UserRole.worker,
      status: 'Active'
    },
    {
      name: 'Name Surname',
      nationality: 'Indonesian',
      dob: 'xx.xx.xxxx',
      trainingStatus: 'started',
      image: '',
      role: UserRole.taiwaneseAgent,
      status: 'InActive'
    },
    {
      name: 'Name Surname',
      nationality: 'Indonesian',
      dob: 'xx.xx.xxxx',
      trainingStatus: 'started',
      image: '',
      role: UserRole.indonesianAgent,
      status: 'Active'
    }
  ];
  filterOptions = [];

  constructor(
    public router: Router,
    public modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  viewDetails(worker) {
    const workerRole = worker.role;
    switch (workerRole) {
      case UserRole.worker:
        return this.router.navigate(['worker/profiles']);
      case UserRole.taiwaneseAgent:
          return this.router.navigate(['workers/details']);
      default:
        return this.router.navigate(['']);
    }
  }

  async createWorker() {
    const modal = await this.modalCtrl.create({
      component: CreatePage,
      cssClass: 'tuna-modal',

    });
    modal.present();

    modal.onDidDismiss().then((data) => {});
  }

  searchResult(result) {}

  filterResult(result) {}
}
