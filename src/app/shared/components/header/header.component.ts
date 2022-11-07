import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() pageTitle: string;
  @Input() isBackButton: boolean = false;
  @Input() isMenuButton: boolean = true;

  constructor() { }

  ngOnInit() {}

}
