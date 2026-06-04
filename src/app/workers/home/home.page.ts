import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { UserRole } from 'src/app/shared/types/api-types';
import { CreatePage } from '../create/create.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';
import { GroupedOption } from 'src/app/shared/components/filter/filter.component';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: false
})
export class HomePage implements OnInit {
  pageTitle = '';
  workerCount = 0;
  workers = [];
  unFilteredData = [];
  groupedFilterOptions: GroupedOption[] = [];
  commonText: any;

  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    public sharedMethods: SharedmethodsService,
    public contentService: ContentService,
    public profilesDataService: ProfilesDataService,
    public analytics: AnalyticsService
  ) {
   
    this.profilesDataService.getAll().subscribe(async(data) => {
      const currentUser = await this.sharedMethods.getUserData();
      // return workers created by current user 
      // remove current user from workers; applies to user with multiple roles

      this.workers = this.unFilteredData = data?.filter((worker: any) => worker?.createdBy === currentUser?.id &&
        (worker?.userRole?.includes('worker')) && 
          (worker?.email !== currentUser?.email || worker?.mobile !== currentUser?.mobile));
    });
  }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.pageTitle = this.commonText?.recruits;
    this.groupedFilterOptions = this.getGroupedFilterOptions();
    this.analytics.trackEvent(PageEventNames.listWorkers, this.sharedMethods.analyticsEventParams)
  }

  // TODO: add filter by vessel, company
  getGroupedFilterOptions(): GroupedOption[] {
    const countryGroupLabel = this.commonText?.filterByCountry;
    const countryOptions = this.contentService.getFormOptions('createworkers', 'country');
    const statusLabel = this.commonText?.filterByStatus;
    const statusOptions = [
      { value: 'active', label: this.commonText?.active },
      { value: 'inactive', label: this.commonText?.inactive },
      { value: 'pending', label: this.commonText.pending}
    ];

    return [
      { groupLabel: countryGroupLabel, groupOptions: countryOptions, filterProperty: 'country' },
      { groupLabel: statusLabel, groupOptions: statusOptions, filterProperty: 'isActive' },
    ];
  }

  viewDetails(worker: any) {
    const workerRole = worker.role;
    const queryParams = worker;
    switch (workerRole) {
      case UserRole.worker:
        return this.router.navigate(['worker/profile'], { queryParams });
      case UserRole.taiwaneseAgent:
        return this.router.navigate(['workers/details'], { queryParams });
      default:
        // TODO: Mak it go to default route
        return this.router.navigate(['workers/details'], { queryParams });
    }
  }

  async createWorker() {
    const modal = await this.modalCtrl.create({
      component: CreatePage,
      cssClass: 'tuna-modal workers-create-modal',

    });
    modal.present();

    modal.onDidDismiss().then((data) => {});
  }

  searchResult(result: any) {
    this.workers = result;
  }

  filterResult(result: any) {
    this.workers = result;
  }

  clearSearchResult() {
    this.workers = this.unFilteredData;
  }
}
