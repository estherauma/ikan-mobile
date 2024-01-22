import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { UserRole } from 'src/app/shared/types/api-types';
import { CreatePage } from '../create/create.page';
import { WorkersDataService } from '../data/workers-data.service';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pageTitle = '';
  workerCount = 0;
  workers = [];
  unFilteredData = [];
  filterOptions = [];
  commonText: any;

  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    public workersDataService: WorkersDataService,
    public sharedMethods: SharedmethodsService,
    public contentService: ContentService,
  ) {
    this.workersDataService.getAll().subscribe((data) => {
      this.workers = this.unFilteredData = data;
    });
  }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.pageTitle = this.commonText?.recruits;
  }

  viewDetails(worker) {
    const workerRole = worker.role;
    const queryParams = worker;
    switch (workerRole) {
      case UserRole.worker:
        return this.router.navigate(['worker/profile'], { queryParams });
      case UserRole.taiwaneseAgent:
          return this.router.navigate(['workers/details'], { queryParams });
      default:
        // TODO: Mak it go to default route
        return this.router.navigate(['workers/details'], { queryParams });
    }
  }

  async createWorker() {
    const modal = await this.modalCtrl.create({
      component: CreatePage,
      cssClass: 'tuna-modal workers-create-modal',

    });
    modal.present();

    modal.onDidDismiss().then((data) => {});
  }

  searchResult(result) {
    this.workers = result;
  }

  filterResult(result) {
    this.workers = result;
  }

  clearSearchResult() {
    this.workers = this.unFilteredData;
  }
}
