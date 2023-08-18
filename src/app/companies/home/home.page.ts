import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreatePage } from '../create/create.page';
import { CompaniesDataService } from '../data/companies-data.service';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  // ToDo: Add localization
  pageTitle = 'Companies';
  companies = [];
  unFilteredData = [];
  newText = 'New';

  constructor(
    public modalCtrl: ModalController,
    public companiesDataService: CompaniesDataService,
    public router: Router,
    public contentService: ContentService,
  ) {
    this.companiesDataService.getAll().subscribe((data) => {
      this.companies = this.unFilteredData = data;
    });
  }

  ngOnInit() { 
    this.newText = this.contentService.commonText?.new;
    this.pageTitle = this.contentService.commonText?.companies;
  }

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
