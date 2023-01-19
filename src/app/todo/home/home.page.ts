import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  badges = new Array(4).fill({
    name: 'Badge name',
    date: 'xx/xx/xxxx'
  });
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  goToPlacement() {
    this.router.navigate(['todo/placement']);
  }

  onNew() {
    this.router.navigate(['todo/new']);
  }

  onList() {
    this.router.navigate(['todo/list']);
  }

}
