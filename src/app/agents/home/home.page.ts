import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pageTitle = 'Manning Agents';
  agents = [
    {
      name: 'Company Name',
      contact: 'Cici Surname',
      email: 'surname@emailaddress.com',
      tel: '+44 789 123 123',
      address: {
        country: 'Uganda',
        zipCode: '256',
        county: 'County',
        town: 'Name of town',
        building: 'Building name',
        road: '123 name of the road'
      }
    },
    {
      name: 'Company Name',
      contact: 'Cici Surname',
      email: 'surname@emailaddress.com',
      tel: '+44 789 123 123',
      address: {
        country: 'Uganda',
        zipCode: '256',
        county: 'County',
        town: 'Name of town',
        building: 'Building name',
        road: '123 name of the road'
      }
    },
    {
      name: 'Company Name',
      contact: 'Cici Surname',
      email: 'surname@emailaddress.com',
      tel: '+44 789 123 123',
      address: {
        country: 'Uganda',
        zipCode: '256',
        county: 'County',
        town: 'Name of town',
        building: 'Building name',
        road: '123 name of the road'
      }
    }
  ];
  constructor(
    public router: Router,
    public sharedMethods: SharedmethodsService
  ) { }

  ngOnInit() {
  }

  searchResult(searchResult) {}

  viewDetails(company) {
    this.router.navigate((['agents/details', company]));
  }
}
