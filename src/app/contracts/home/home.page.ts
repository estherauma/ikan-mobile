import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CompaniesDataService } from 'src/app/companies/data/companies-data.service';
import { CreatePage } from '../create/create.page';
import { ContractDataService } from '../data/contract-data.service';


export interface IContracts {
  name: string;
  companyName: string;
  date: string;
  vesselName: string;
  image: string;
  ref: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  //TODO: Use translated text from prismic
  pageTitle = 'Contracts';

  contracts: IContracts[] = [
    {
      name: 'Budi Surname',
      companyName: 'Talents company name',
      vesselName: 'Vessel Name',
      date: '2022-10-23',
      ref: 'Contract1234567',
      image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
    },
    {
      name: 'Budi Surname',
      companyName: 'Talents company name',
      vesselName: 'Vessel Name',
      date: '2022-10-23',
      ref: 'Contract1234567',
      image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
    },
    {
      name: 'Budi Surname',
      companyName: 'Talents company name',
      vesselName: 'Vessel Name',
      date: '2022-10-23',
      ref: 'Contract1234567',
      image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
    },
    {
      name: 'Budi Surname',
      companyName: 'Talents company name',
      vesselName: 'Vessel Name',
      date: '2022-10-23',
      ref: 'Contract1234567',
      image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
    },
    {
      name: 'Budi Surname',
      companyName: 'Talents company name',
      vesselName: 'Vessel Name',
      date: '2022-10-23',
      ref: 'Contract1234567',
      image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
    },
    {
      name: 'Budi Surname',
      companyName: 'Talents company name',
      vesselName: 'Vessel Name',
      date: '2022-10-23',
      ref: 'Contract1234567',
      image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
    }
  ];

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


  viewDeatils(demandLetter: IContracts) {
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
      cssClass: 'tuna-modal'
    });
    modal.present();
  }

  filterResult(result) {
    this.contracts = result;
  }
}
