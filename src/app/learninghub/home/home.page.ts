import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pageTitle='Learning Hub';

  learningHub = [
    {
      name: 'Sub chapter No.1',
      description: 'IJSWERWXDWER',
      image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
    },
    {
      name: 'Cultural orientation',
      description: 'IJSWERWXDWER',
      image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
    },
    {
      name: 'Food & dietry requirements',
      description: 'IJSWERWXDWER',
      image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
    },
    {
      name: 'Religion',
      description: 'IJSWERWXDWER',
      image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
    },
    {
      name: 'Etc.',
      description: 'IJSWERWXDWER',
      image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
    }
  ];

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  viewDeatils(lh) {
    this.router.navigate(['/learninghub/detail', lh]);
  }

}
