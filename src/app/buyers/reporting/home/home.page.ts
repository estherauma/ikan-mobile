import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  reports =  new Array(10).fill(
    {
      name: 'Report Name',
      date: 'XX/XX/XXXX',
      time: '14:07'
    });

  filterOptions = [
    {title:'time', value:'14:07'},
    {title:'time', value:'14:07'}
  ];
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  filterResult(data) {}

  onNewReport() {
    this.router.navigate(['/buyers/create']);
  }

}
