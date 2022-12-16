import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  imageUrl = 'https://cdn.pixabay.com/photo/2016/11/30/20/44/computer-1873831_1280.png';
  constructor() { }

  ngOnInit() {}

}
