import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreatePage } from '../create/create.page';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { DemandlettersDataService } from 'src/app/demandletter/data/demandletters-data.service';


export interface DemandLetter {
  name: string;
  internalRef: string;
  appRef: string;
  dateOpened: string;
  status: string;
  image: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pageTitle='Demand Letters';
  filterDataSet = [];
  demandLetters = [...this.filterDataSet];

  filterOptions = [
    {title:'closed', value:'closed'},
    {title:'open', value:'open'}
  ];

  constructor(
    public modalCtrl: ModalController,
    private router: Router,
    public sharedMethods: SharedmethodsService,
    public demandLettersDataService: DemandlettersDataService,
  ) {
    this.demandLettersDataService.getAll().subscribe((data) => {
      this.demandLetters = data;
    });
  }

  ngOnInit() {
  }

  async createDemandLetter() {
    const modal = await this.modalCtrl.create({
      component: CreatePage,
      cssClass: 'tuna-modal',
    });

    modal.present();

    modal.onDidDismiss().then((data) => {});
  }

  viewDetails(demandLetter: DemandLetter) {
    this.router.navigate(['/demandletters/view', { demandLetter: JSON.stringify(demandLetter) }]);
  }

  filterResult(result) {
    this.demandLetters = result;
  }

  searchResult(result) {
    this.demandLetters = result;
  }

}
