import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-taiwaneseagent',
  templateUrl: './taiwaneseagent.page.html',
  styleUrls: ['./taiwaneseagent.page.scss'],
})
export class TaiwaneseagentPage implements OnInit {

  sLists = [
    {title: 'Work Orders'},
    {title: 'Demand Letters'},
    {title: 'Recruits'},
    {title: 'Payments'},
    {title: 'Learning Hub'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
