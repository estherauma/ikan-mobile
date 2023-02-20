import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-variant',
  templateUrl: './variant.page.html',
  styleUrls: ['./variant.page.scss'],
})
export class VariantPage implements OnInit {


  imgUrl = 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg';

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

  viewDetials(lh) {
    this.router.navigate(['/learninghub/section']);
  }
}
