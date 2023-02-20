import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreatePage } from '../create/create.page';
import { CompaniesDataService } from '../data/companies-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  // ToDo: Add localization
  pageTitle = 'Companies';
  companies = [];
  constructor(
    public modalCtrl: ModalController,
    public companiesDataService: CompaniesDataService,
    public router: Router
  ) {
    this.companiesDataService.getAll().subscribe((data) => {
      this.companies = data;
    });
  }

  ngOnInit() { }

  async createCompany() {
    const modal = await this.modalCtrl.create({
      component: CreatePage,
      cssClass: 'notification-modal'
    });
    modal.present();

  }

  viewDetails(company) {
    this.router.navigate(['/companies/details', company]);
  }
}
