import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreatePage } from '../../create/create.page';
import { ContractDataService } from '../../data/contract-data.service';
import { ContentService } from '../../../shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: false
})
export class HomePage implements OnInit {
  commonText: any;
  pageTitle = 'Company Contracts';
  contracts = [];
  unfilteredData = [];
  filterOptions = [];

  constructor(
    public router: Router,
    public contractsDataService: ContractDataService,
    public modalCtrl: ModalController,
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
  ) {
    this.contractsDataService.getAll().subscribe((data) => {
      this.contracts = this.unfilteredData = data;
    });
  }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.pageTitle = this.commonText?.companyContracts;
  }


  viewDeatils(demandLetter) {
    this.router.navigate(['/contracts/view', demandLetter]);
  }

  searchResult(searchResultData) {
    this.contracts = searchResultData;
  }

  clearSearchResult() {
    this.contracts = this.unfilteredData;
  }

  async createContract() {
    const modal = await this.modalCtrl.create({
      component: CreatePage,
      cssClass: 'notification-modal'
    });
    modal.present();
  }

  filterResult(result) {
    this.contracts = result;
  }

  // TODO: Move to sharedMethods
  getContractDates(contract) {
    const lang = this.contentService.currentLanguage;
    const start = this.sharedMethods.formatLocalDate(contract?.startDate, lang);
    const end = this.sharedMethods.formatLocalDate(contract?.endDate, lang);
    return `${start} - ${end}`;
  }

}
