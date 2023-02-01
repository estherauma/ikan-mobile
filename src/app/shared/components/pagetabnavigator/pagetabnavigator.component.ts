import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagetabnavigator',
  templateUrl: './pagetabnavigator.component.html',
  styleUrls: ['./pagetabnavigator.component.scss'],
})
export class PagetabnavigatorComponent implements OnInit {
  @Input() navItems = [];
  @Input() active = this.navItems.length && this.navItems[0];
  @Input() bgType: 'darkblue-bg' | 'transparent' = 'darkblue-bg';
  @Input() isLinkNavMethod = false;
  @Output() clickedMenuItem: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    public router: Router
  ) { }

  ngOnInit() { }

  onClickLink(selected) {
    this.router.navigate([`/${selected.url}`]);
  }

  onClickedMenuItem(event) {
    this.clickedMenuItem.emit(event);
  }

}
