import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-info',
    templateUrl: './info.page.html',
    styleUrls: ['./info.page.scss'],
    standalone: false
})
export class InfoPage implements OnInit {
  workerInfo = {
    email:'okumujustine01@gmail.com',
    phone:'+256781459239',
    building: 'Building Name',
    street: '123 Name of Road',
    town: 'Name of Town',
    county: 'County',
    zipCode: 'Zip Code',
    country: 'Country'
  };

  constructor() { }

  ngOnInit() {
  }

}
