import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys, UserData } from 'src/app/shared/types/api-types';
import { VesselsDataService } from 'src/app/vessels/data/vessels-data.service';
import { WagesDataService } from '../data/wages-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  
  commonText: any;
  paymentsCommonText: any;
  pageTitle = 'Wage payments';
  unFilteredData = [];
  vessels = [];
  currentUser: UserData;
  userWages = [];
  allUsers = [];

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
      // TODO: filter data based on user role
      // filtering by createdBy because the vessels are only displayed for VOs
      this.vessels = this.unFilteredData = data?.filter(
        (vessel) => vessel.createdBy === this.currentUser.id
      );
    });
  }

  ngOnInit() {}

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
}
