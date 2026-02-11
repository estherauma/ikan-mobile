import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys, UserData, UserRole } from 'src/app/shared/types/api-types';
import { VesselsDataService } from 'src/app/vessels/data/vessels-data.service';
import { WagesDataService } from '../data/wages-data.service';
import { firstValueFrom } from 'rxjs';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  
  commonText: any;
  paymentsPageData: any;
  paymentsCommonText: any;
  pageTitle = 'Wage payments';
  unFilteredData = [];
  allVessels = [];
  vessels = [];
  currentUser: UserData;
  userWages = [];
  allUsers = [];

  // Filtering
  filterDataSet = [
    {
      name: 'Vessel Company One',
      status: 'Opened',
    },
    {
      name: 'Vessel Company Two',
      status: 'Closed',
    },
    {
      name: 'Vessel Company Three',
      status: 'Opened',
    },
    {
      name: 'Vessel Company Four',
      status: 'Closed',
    },
  ];
  chineseFilterDataSet = [
    {
      name: '船隻公司',
      status: 'Opened',
    },
    {
      name: '船隻公司第二',
      status: 'Closed',
    },
    {
      name: '船隻公司三',
      status: 'Opened',
    },
    {
      name: '船隻公司四',
      status: 'Closed',
    },
  ];
  organizations = [...this.filterDataSet];
  filterOptions = [
    { title: 'closed', value: 'closed' },
    { title: 'opened', value: 'opened' },
  ];

  constructor(
    public router: Router,
    public contentService: ContentService,
    public vesselsDataService: VesselsDataService,
    public wagesDataService: WagesDataService,
    public sharedMethods: SharedmethodsService,
    public analyticsService: AnalyticsService,
    public profilesDataService: ProfilesDataService
  ) {
    this.vesselsDataService.getAll().subscribe(async (data) => {
      await this.getCurrentUser();
      this.allVessels = data;
      // TODO: filter data based on user role
      // filtering by createdBy because the vessels are only displayed for VOs
      this.vessels = this.unFilteredData = data?.filter(
        (vessel) => vessel.createdBy === this.currentUser?.id
      );
    });
    this.wagesDataService.getAll().subscribe(async(data) => {
      await this.getCurrentUser();
      const users = await firstValueFrom(this.profilesDataService.getAll());
      this.allUsers = users;

      if (this.currentUser?.role === UserRole.worker) {
        this.userWages = data?.filter(
          (wage) => wage.userId === this.currentUser?.id
        );
      } else if (this.currentUser?.role === UserRole.vesselOwner) {
        this.userWages = data?.filter(
          (wage) => wage.createdBy === this.currentUser?.id
        );
      }

      // Add user & vessel details wages
      this.userWages = this.userWages.map((wage) => {
        let vessel = null;
        if (this.currentUser?.role === UserRole.worker) {
          vessel = this.allVessels.find(
            (v) => v.onlineRef === wage.vesselId
          );
        } else if (this.currentUser?.role === UserRole.vesselOwner) {
          vessel = this.vessels.find(
            (v) => v.onlineRef === wage.vesselId
          );
        }
        const user = this.allUsers.find(
          (u) => u.onlineRef === wage.userId
        );
        return {
          ...wage,
          vessel: vessel ?? null,
          user: user ?? null,
        };
      });
    });
  }

  async ngOnInit() {
    await this.getCurrentUser();
    this.commonText = await this.contentService?.commonText;
    this.paymentsPageData = this.contentService.getContentByPropertyName('payments-common-text');
    console.log('paymentsPageData.........', this.paymentsPageData);
    this.paymentsCommonText = this.sharedMethods.convertAdditionalTextToObj(this.paymentsPageData?.additionalText);
    this.pageTitle = this.paymentsCommonText?.wagePayments;
    this.filterOptions = [
      { title: this.commonText?.closed, value: 'closed' },
      { title: this.commonText?.opened, value: 'opened' },
    ];

    // For testing purposes
    if (this.contentService?.currentLanguage === 'qm-zh') {
      this.organizations = [...this.chineseFilterDataSet];
    }

    const analyticsEventParams = await this.sharedMethods.getAnalyticsEventParams();
    this.analyticsService.trackEvent(PageEventNames.viewWages, analyticsEventParams);
  }

  async getCurrentUser() {
    this.currentUser = await this.sharedMethods.readDataFromStorage(
      StorageKeys.userData
    );
  }

  goToVesselWages(vessel) {
    const queryParams = { vessel: JSON.stringify(vessel) };
    this.router.navigate(['wages/vessel-wages'], { queryParams });
  }

  goToWageDetail(wageDetails) {
    const queryParams = { wageDetails: JSON.stringify(wageDetails) };
    this.router.navigate(['wages/wage-details'], { queryParams });
  }
  
  searchResult(data) {
    this.organizations = data;
  }

  filterResult(result) {
    this.organizations = result;
  }
}
