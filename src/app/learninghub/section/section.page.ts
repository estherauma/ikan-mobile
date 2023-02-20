import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-section',
  templateUrl: './section.page.html',
  styleUrls: ['./section.page.scss'],
})
export class SectionPage implements OnInit {
  imgUrl = 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg';

  questions = [
    {
      type: 'question'
    },
    {
      type: 'success'
    },
    {
      type: 'warning'
    },
    {
      type: 'error'
    }
  ];

  learningHub = {
      name: 'Sub chapter No.1',
      description: 'IJSWERWXDWER',
      image: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg',
    };

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  onViewDetails(lh) {
    this.router.navigate(['/learninghub/detail', lh]);
  }
}
