import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { VesselsDataService } from 'src/app/vessels/data/vessels-data.service';
import { UserData, StorageKeys, UserRole } from 'src/app/shared/types/api-types';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';
import { firstValueFrom } from 'rxjs';
import { WagesDataService } from '../data/wages-data.service';

type GroupedVesselWages = {
  date: string;
  wages: any[];
  isExpanded: boolean;
};

@Component({
  selector: 'app-vessel-wages',
  templateUrl: './vessel-wages.component.html',
  styleUrls: ['./vessel-wages.component.scss'],
  standalone: false,
})
export class VesselWagesComponent  implements OnInit {

  commonText: any;
  paymentsCommonText: any;
  currentUser: UserData;
  currentLanguage = 'en-us';
  vessel: any;
  pageTitle = 'Vessel wage payments';
  filterOptions = [
    { title: 'closed', value: 'closed' },
    { title: 'opened', value: 'opened' },
  ];
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
  unFilteredData = [];
  vesselWages = [];
  groupedVesselWages: GroupedVesselWages[] = [];
  allUsers = [];

  constructor(
    public router: Router,
    public contentService: ContentService,
    public vesselsDataService: VesselsDataService,
    public sharedMethods: SharedmethodsService,
    public activatedRoute: ActivatedRoute,
    public analyticsService: AnalyticsService,
    public profileDataService: ProfilesDataService,
    public wagesDataService: WagesDataService,
  ) {

    this.activatedRoute.queryParams.subscribe(async(params) => {
      if (params?.vessel) {
        this.vessel = JSON.parse(params.vessel);
        const users = await firstValueFrom(this.profileDataService.getAll());
        this.allUsers = users;

        this.wagesDataService.getAll().subscribe(async(data) => {
          this.currentUser = await this.sharedMethods.readDataFromStorage(
            StorageKeys.userData
          );
          this.vesselWages = data?.filter(
            (wage) =>
              wage.vesselId === this.vessel.onlineRef &&
              wage.createdBy === this.currentUser.id
          );

          // Add user & vessel details to each wage
          this.vesselWages = this.vesselWages.map((wage) => {
            const user = this.allUsers.find(
              (u) => u.onlineRef === wage.userId
            );
            // For VO, change wage status to 'pending' & 'confirmed'
            if (this.currentUser?.role === UserRole.vesselOwner) {
              if (wage?.status === 'action_required' || wage?.status === 'issue_pending') {
                wage.status = 'pending';
              }
              if (wage?.status === 'received') {
                wage.status = 'confirmed';
              }
            }
            
            return {
              ...wage,
              user: user ?? null,
              vessel: this.vessel,
            };
          });

          // group vessel wages by date
          this.groupedVesselWages = this.groupWagesByDate(
            this.vesselWages
          );
        });
      }
    });
  }

  async ngOnInit() {
    this.commonText = await this.contentService?.commonText;
    this.currentLanguage = this.contentService?.currentLanguage;
    const paymentsPageData = this.contentService.getContentByPropertyName('payments-common-text');
    this.paymentsCommonText = this.sharedMethods.convertAdditionalTextToObj(paymentsPageData?.additionalText);
    // TODO: translate
    this.pageTitle = this.paymentsCommonText?.vesselWagePayments || 'Vessel wage payments';

    const analyticsEventParams = await this.sharedMethods.getAnalyticsEventParams();
    this.analyticsService.trackEvent(PageEventNames.viewVesselWages, analyticsEventParams);
  }


  groupWagesByDate(wages) {
    const grouped = wages.reduce((acc, wage) => {
      const date = new Date(wage.paymentDate).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(wage);
      return acc;
    }, {});

    const vesselWages = Object.keys(grouped).map((date) => ({
      date: this.sharedMethods.formatLocalDate(date, this.currentLanguage),
      wages: grouped[date],
      isExpanded: false,
    }));

    return vesselWages;
  }

  toggleGroup(index: number) {
    this.groupedVesselWages[index].isExpanded =
      !this.groupedVesselWages[index].isExpanded;
  }

  filterResult(result) {}

  goToWageDetail(wageDetails) {
    const queryParams = { wageDetails: JSON.stringify(wageDetails) };
    this.router.navigate(['wages/wage-details'], { queryParams });
  }
}
