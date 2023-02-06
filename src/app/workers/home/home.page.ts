import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { UserRole } from 'src/app/shared/types/api-types';
import { CreatePage } from '../create/create.page';
import { WorkersDataService } from '../data/workers-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pageTitle = 'Recruits';
  workerCount = 0;
  workers = [];
  filterOptions = [];

  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    public workersDataService: WorkersDataService,
    public sharedMethods: SharedmethodsService
  ) {
    this.workersDataService.getAll().subscribe((data) => {
      this.workers = data;
    });
  }

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
