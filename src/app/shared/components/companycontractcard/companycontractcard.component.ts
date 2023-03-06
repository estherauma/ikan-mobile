import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-companycontractcard',
  templateUrl: './companycontractcard.component.html',
  styleUrls: ['./companycontractcard.component.scss'],
})
export class CompanycontractcardComponent implements OnInit {
  @Input() title = '';
  @Input() contract = '';
  @Input() vessel = '';
  @Input() dates = '';
  @Input() isLight = false;
  @Input() hideImage = false;

  constructor() { }

  ngOnInit() {}

}
