import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  commonText: any;
  filterDataSet =  [
    {
      name: 'Name of Vessel Company',
      status: 'Opened',

    },
    {
      name: 'Name2 of Vessel Company',
      status: 'Closed',
    },
    {
      name: 'Name3 of Vessel Company',
      status: 'Opened',
    },
    {
      name: 'Name4 of Vessel Company',
      status: 'Closed',
    }
  ];
  pageTitle = 'Payments';

  organizations = [...this.filterDataSet];

  filterOptions = [
    {title:'closed', value:'closed'},
    {title:'opened', value:'opened'}
  ];


  constructor(
    public router: Router,
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    console.log(this.commonText);
    this.pageTitle = this.commonText?.payments;
    this.filterOptions = [
      {title: this.commonText?.closed, value: 'closed'},
      {title: this.commonText?.opened, value: 'opened'}
    ];
  }

  searchResult(data) {
    this.organizations = data;
  }

  filterResult(result) {
    this.organizations = result;
  }


  viewDetails(organization) {
    this.router.navigate(['payments/view/company', organization]);
  }

}
