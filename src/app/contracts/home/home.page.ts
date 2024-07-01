import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreatePage } from '../create/create.page';
import { ContractDataService } from '../data/contract-data.service';
import { ContentService } from '../../shared/services/content/content.service';
import { formatDate } from "@angular/common";
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CompaniesDataService } from 'src/app/companies/data/companies-data.service';
import { GroupedOption } from 'src/app/shared/components/filter/filter.component';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { UserData, UserRole } from 'src/app/shared/types/api-types';


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
  groupedFilterOptions: GroupedOption[] = [];

  constructor(
    public router: Router,
    public contractsDataService: ContractDataService,
    public modalCtrl: ModalController,
    public contentService: ContentService,
    public authService: AuthService,
    public companiesDataService: CompaniesDataService,
    public sharedMethods: SharedmethodsService,

  ) {
    this.contractsDataService.getAll().subscribe(async(allContracts) => {
      const contracts = await this.getContractsByRole(allContracts);
      this.contracts = this.unfilteredData = contracts;
      this.pageTitle = this.commonText?.contracts;
    });
  }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.pageTitle = this.commonText?.contracts;
    this.groupedFilterOptions = this.getGroupedFilterOptions();
  }

  async getContractsByRole(allContracts: any[]) {
    const user: UserData = await this.sharedMethods.getUserData();
    if (user?.role === UserRole.vesselOwner) {
      return allContracts.filter(contract => contract?.createdBy === user.id);
    } else if (user?.role === UserRole.worker) {
      // TODO: refactor logic
      return allContracts.filter(contract => contract?.userId === user.id);
    }
    return [];
  }
  
  // TODO: add filter by vessel
  getGroupedFilterOptions(): GroupedOption[]{
    const group1Label = this.commonText?.filterByTaiwaneseCompanies;
    const group1Options = this.companiesDataService.getCountryCompanyOptions('Taiwan');
    const group2Label = this.commonText?.filterByIndonesianCompanies;
    const group2Options = this.companiesDataService.getCountryCompanyOptions('Indonesia');
    const typeGroupLabel = this.commonText?.filterByType;
    const typeGroupOptions = this.contentService.getFormOptions('companies-createcontract', 'type');
    
    return [
      { groupLabel: group1Label, groupOptions: group1Options, filterProperty: 'taiwaneseCompany' },
      { groupLabel: group2Label, groupOptions: group2Options, filterProperty: 'indonesianCompany' },
      { groupLabel: typeGroupLabel, groupOptions: typeGroupOptions, filterProperty: 'kind' }
    ];
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
  // Todo: Our locales apart from english through an error. Setting this here to english for now.
  getContractDates(contract) {
    const locale = this.contentService.currentLanguage;
    const start = formatDate(contract?.startDate, 'dd/MM/yyyy', 'en-us');
    const end = formatDate(contract?.endDate, 'dd/MM/yyyy', 'en-us');
    return `${start} - ${end}`;
  }
}
