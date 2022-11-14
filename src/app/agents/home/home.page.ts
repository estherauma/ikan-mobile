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
      addrCountry: 'Uganda',
      addrZip: '256',
      addrCounty: 'County',
      addrTown: 'Name of town',
      addrBuilding: 'Building name',
      addrRoad: '123 name of the road'
    },
    {
      name: 'Company Name',
      contact: 'Cici Surname',
      email: 'surname@emailaddress.com',
      tel: '+44 789 123 123',
      addrCountry: 'Uganda',
      addrZip: '256',
      addrCounty: 'County',
      addrTown: 'Name of town',
      addrBuilding: 'Building name',
      addrRoad: '123 name of the road'
    },
    {
      name: 'Company Name',
      contact: 'Cici Surname',
      email: 'surname@emailaddress.com',
      tel: '+44 789 123 123',
      addrCountry: 'Uganda',
      addrZip: '256',
      addrCounty: 'County',
      addrTown: 'Name of town',
      addrBuilding: 'Building name',
      addrRoad: '123 name of the road'
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
