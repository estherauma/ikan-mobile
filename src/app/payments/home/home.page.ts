import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
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
    public router: Router
  ) { }

  ngOnInit() {
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
