import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewclause',
  templateUrl: './viewclause.page.html',
  styleUrls: ['./viewclause.page.scss'],
})
export class ViewclausePage implements OnInit {
  company = {
    name: 'Company 1',
  }
  constructor() { }

  ngOnInit() {
  }
  
}
