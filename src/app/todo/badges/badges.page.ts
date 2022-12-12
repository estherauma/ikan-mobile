import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.page.html',
  styleUrls: ['./badges.page.scss'],
})
export class BadgesPage implements OnInit {
  badges = new Array(30).fill({
    name: 'Badge name',
    date: 'xx/xx/xxxx'
  });
  constructor() { }

  ngOnInit() {
  }

}
