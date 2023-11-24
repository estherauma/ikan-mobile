import { Component, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { SteponePage } from '../create/stepone/stepone.page';
import { VesselsDataService } from '../data/vessels-data.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { DBService } from 'src/app/shared/services/database/db.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  //TODO: Use translated text from prisimic
  pageTitle = 'Vessels';
  vessels = [];
  unFilteredData = [];
  filterOptions = [
    {title:'Active Duty', value:'Active Duty'},
    {title:'', value:'opened'}
  ];
  filterText = 'Filter';
  newText = 'New';

  constructor(
    public menuCtrl: MenuController,
    public router: Router,
    public modalController: ModalController,
    public vesselsDataService: VesselsDataService,
    public contentService: ContentService,
    public dbService: DBService,
    public sharedMethods: SharedmethodsService
  ) {
    this.vesselsDataService.getAll().subscribe((data) => {
      this.vessels = this.unFilteredData = data;
    });
  }

  ngOnInit() {
    this.filterText = this.contentService.commonText?.filter;
    this.pageTitle = this.contentService.commonText?.vessels;
    this.newText = this.contentService.commonText?.new;
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  async createVessel() {
    const modal = await this.modalController.create({
      component: SteponePage,
      cssClass: 'notification-modal'
    });

    modal.present();

    modal.onDidDismiss().then((data) => {
    });
  }

  searchResult(result) {
    this.vessels = result;
  }

  clearSearchResult() {
    this.vessels = this.unFilteredData;
  }

  filterResult(result) {
    this.vessels = result;
  }
}
