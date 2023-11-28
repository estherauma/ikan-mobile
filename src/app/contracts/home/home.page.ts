import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreatePage } from '../create/create.page';
import { ContractDataService } from '../data/contract-data.service';
import { ContentService } from '../../shared/services/content/content.service';
import { formatDate } from "@angular/common";
import { AuthService } from 'src/app/shared/services/auth/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pageTitle = 'Contracts';
  commonText: any;
  contracts = [];
  unfilteredData = [];
  filterOptions = [];

  constructor(
    public router: Router,
    public contractsDataService: ContractDataService,
    public modalCtrl: ModalController,
    public contentService: ContentService,
    public authService: AuthService

  ) {
    this.contractsDataService.getAll().subscribe((data) => {
      this.contracts = this.unfilteredData = data;
      this.pageTitle = this.commonText?.contracts;
    });
  }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.pageTitle = this.commonText?.contracts;
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
    const locale = this.contentService.currentLanguage;
    const start = formatDate(contract?.startDate, 'dd/MM/yyyy', locale);
    const end = formatDate(contract?.endDate, 'dd/MM/yyyy', locale);
    return `${start} - ${end}`;
  }
}
