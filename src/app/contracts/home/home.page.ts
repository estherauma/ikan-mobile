import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CompaniesDataService } from 'src/app/companies/data/companies-data.service';
import { CreatePage } from '../create/create.page';
import { ContractDataService } from '../data/contract-data.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  //TODO: Use translated text from prismic
  pageTitle = 'Contracts';

  contracts = [];

  unfilteredData = [];
  filterOptions = [];

  constructor(
    public router: Router,
    public contractsDataService: ContractDataService,
    public modalCtrl: ModalController,

  ) {
    this.contractsDataService.getAll().subscribe((data) => {
      this.contracts = this.unfilteredData = data;
    });
  }

  ngOnInit() {
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

  getContractDates(contract) {
    return `${contract.startDate} - ${contract.endDate}`;
  }
}
