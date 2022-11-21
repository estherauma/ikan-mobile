import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pageTitle = 'Workers';
  workers = [
    {
      name: 'Name Surname',
      nationality: 'Indonesian',
      dob: 'xx.xx.xxxx',
      trainingStatus: 'started',
      image: ''
    },
    {
      name: 'Name Surname',
      nationality: 'Indonesian',
      dob: 'xx.xx.xxxx',
      trainingStatus: 'started',
      image: ''
    },
    {
      name: 'Name Surname',
      nationality: 'Indonesian',
      dob: 'xx.xx.xxxx',
      trainingStatus: 'started',
      image: ''
    }
  ];

  constructor(
    public router: Router
  ) {}

  ngOnInit() {}

  viewDetails(worker) {
    this.router.navigate(['workers/details', worker]);
  }
}
