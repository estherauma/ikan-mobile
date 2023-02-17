import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-companiescard',
  templateUrl: './companiescard.component.html',
  styleUrls: ['./companiescard.component.scss'],
})
export class CompaniescardComponent implements OnInit {
  @Input() company;
  constructor() { }

  ngOnInit() {}

}
