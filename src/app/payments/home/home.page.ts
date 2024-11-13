import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { VesselsDataService } from 'src/app/vessels/data/vessels-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  commonText: any;
  filterDataSet =  [
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
    }
  ];
  chineseFilterDataSet =  [
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
    }
  ];
  vesselCompanyText = 'Details about this vessel company';
  chineseVesselCompanyText = '有關該船隻公司的詳細信息';

  pageTitle = 'Payments';
  organizations = [...this.filterDataSet];

  filterOptions = [
    {title:'closed', value:'closed'},
    {title:'opened', value:'opened'}
  ];
  unFilteredData = [];
  vessels = [];

  // remove after fixing filtering
  // TODO: fix filtering

  constructor(
    public router: Router,
    public contentService: ContentService,
    public vesselsDataService: VesselsDataService,
  ) {
    this.vesselsDataService.getAll().subscribe((data) => {
      this.vessels = this.unFilteredData = data;
    });
  }

  async ngOnInit() {
    this.commonText = await this.contentService?.commonText;
    this.pageTitle = this.commonText?.payments;
    this.filterOptions = [
      {title: this.commonText?.closed, value: 'closed'},
      {title: this.commonText?.opened, value: 'opened'}
    ];

    // For testing purposes
    if (this.contentService?.currentLanguage === 'qm-zh') {
      this.organizations = [...this.chineseFilterDataSet];
      this.vesselCompanyText = this.chineseVesselCompanyText;
    }
  }

  searchResult(data) {
    this.organizations = data;
  }

  filterResult(result) {
    this.organizations = result;
  }


  viewDetails(organization) {
    const queryParams = organization
    this.router.navigate(['payments/view/company', organization], { queryParams });
  }

  goToVesselPayments(vessel) {
    console.log('vessel', vessel);
  }
}
