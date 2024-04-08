import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreatePage } from '../create/create.page';
import { CompaniesDataService } from '../data/companies-data.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

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
    public sharedMethods: SharedmethodsService
  ) {
    this.companiesDataService.getAll().subscribe((data) => {
      // We'll need to remove this eventually. But for now, if there are any records that have no app ref,
      // they are given an app ref
      for (let company of data) {
        if (company.appRef == null || company.appRef == '' || company.appRef == undefined) {
          company.appRef = this.sharedMethods.generateAppRef();
          this.companiesDataService.setAppRef(company.id, company.app_ref);
        }
      }
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
