import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreatePage } from '../create/create.page';
import { ContractDataService } from '../data/contract-data.service';
import { ContentService } from '../../shared/services/content/content.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CompaniesDataService } from 'src/app/companies/data/companies-data.service';
import { GroupedOption } from 'src/app/shared/components/filter/filter.component';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys, UserRole } from 'src/app/shared/types/api-types';
import { VesselsDataService } from 'src/app/vessels/data/vessels-data.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: false
})
export class HomePage implements OnInit {
  pageTitle = 'Contracts';
  commonText: any;
  contracts = [];
  unfilteredData = [];
  filterOptions = [];
  groupedFilterOptions: GroupedOption[] = [];
  userRole: string;
  userData: any;

  constructor(
    public router: Router,
    public contractsDataService: ContractDataService,
    public modalCtrl: ModalController,
    public contentService: ContentService,
    public authService: AuthService,
    public companiesDataService: CompaniesDataService,
    public sharedMethods: SharedmethodsService,
    public vesselDataService: VesselsDataService,
  ) {
    this.contractsDataService.getAll().subscribe(async(allContracts) => {
      this.userData = await this.sharedMethods.getUserData();
      this.userRole = this.userData?.role;
      const contracts = this.userRole === UserRole.vesselOwner ? await this.getVOContracts(allContracts) :
        await this.getUserContracts(allContracts);
      this.contracts = this.unfilteredData = contracts;
      this.addVesselNameToContracts();
      this.pageTitle = this.commonText?.contracts;
    });
  }

  addVesselNameToContracts() {
    this.contracts.forEach(async(contract) => {
      const vesselName = await this.getVesselName(contract);
      contract.vesselName = vesselName;
    });
  }

  async getVesselName(contract) {
    let vesselName = '';
    const partyBClause = await this.contractsDataService.retrieveClauseByFieldByContractId(
      'kind',
      'contract-clauses-parties-requirement-fishers',
      contract.id
    );
    if (partyBClause && partyBClause?.content) {
      const parsedContent = JSON.parse(partyBClause?.content);
      if (parsedContent?.vessel) {
        const  vessel = await this.vesselDataService.getVesselByField('appRef', parsedContent.vessel);
        if (vessel) {
          vesselName = vessel?.name;
        }
      }
    }
    return vesselName;
  }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.pageTitle = this.commonText?.contracts;
    this.groupedFilterOptions = this.getGroupedFilterOptions();
  }

  async getUserContracts(allContracts: any[]) {
    const onlineContracts = await this.sharedMethods.readDataFromStorage(StorageKeys.currentUserOnlineContractsAppRefs);
    return allContracts.filter(contract => onlineContracts?.includes(contract.appRef));
  }
  async getVOContracts(allContracts: any[]) {
    const onlineContracts = await this.sharedMethods.readDataFromStorage(StorageKeys.currentUserOnlineContractsAppRefs);
    return allContracts.filter(contract => onlineContracts?.includes(contract.appRef) || contract.createdBy === this.userData?.id);
  }

  // TODO: add filter by vessel
  getGroupedFilterOptions(): GroupedOption[] {
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


  viewDetails(details) {
    this.router.navigate(['/contracts/view', details]);
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
    const lang = this.contentService.currentLanguage;
    const start = this.sharedMethods.formatLocalDate(contract?.startDate, lang);
    const end = this.sharedMethods.formatLocalDate(contract?.endDate, lang);
    return `${start} - ${end}`;
  }
}
