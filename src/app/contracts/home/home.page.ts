import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


export interface IContracts {
  name: string;
  companyName: string;
  date: string;
  vesselName: string;
  image: string;
  ref: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  //TODO: Use translated text from prismic
  pageTitle = 'Contracts';

  contracts: IContracts[] = [
    {
      name: 'Budi Surname',
      companyName: 'Talents company name',
      vesselName: 'Vessel Name',
      date: '2022-10-23',
      ref: 'Contract1234567',
      image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
    },
    {
      name: 'Budi Surname',
      companyName: 'Talents company name',
      vesselName: 'Vessel Name',
      date: '2022-10-23',
      ref: 'Contract1234567',
      image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
    },
    {
      name: 'Budi Surname',
      companyName: 'Talents company name',
      vesselName: 'Vessel Name',
      date: '2022-10-23',
      ref: 'Contract1234567',
      image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
    },
    {
      name: 'Budi Surname',
      companyName: 'Talents company name',
      vesselName: 'Vessel Name',
      date: '2022-10-23',
      ref: 'Contract1234567',
      image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
    },
    {
      name: 'Budi Surname',
      companyName: 'Talents company name',
      vesselName: 'Vessel Name',
      date: '2022-10-23',
      ref: 'Contract1234567',
      image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
    },
    {
      name: 'Budi Surname',
      companyName: 'Talents company name',
      vesselName: 'Vessel Name',
      date: '2022-10-23',
      ref: 'Contract1234567',
      image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
    }
  ];

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }


  viewDeatils(demandLetter: IContracts) {
    this.router.navigate(['/contracts/view', demandLetter]);
  }

  searchResult(searchResultData) {

  }
}
