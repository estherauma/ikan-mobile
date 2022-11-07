import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  organizations =  [
    {
      name: 'Name of Vessel Company'
    },
    {
      name: 'Name2 of Vessel Company'
    },
    {
      name: 'Name3 of Vessel Company'
    },
    {
      name: 'Name4 of Vessel Company'
    }
  ];
  pageTitle = 'Payments';

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  searchResult(data) {
    // TODO: Fix this so that when search string is cleared, full result of thigns is displayed.
    this.organizations = data;
  }

  viewDetails(organization) {
    this.router.navigate(['payments/view/company', organization]);
  }

}
