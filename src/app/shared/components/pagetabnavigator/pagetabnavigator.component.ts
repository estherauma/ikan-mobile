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
  @Input() bgType: 'darkblue-bg' | 'transparent' = 'transparent';
  @Input() isLinkNavMethod = false;
  @Output() clickedMenuItem: EventEmitter<any> = new EventEmitter<any>();
  defaultOffsideLength = this.navItems.length + 100;

  firstNeighborId = this.defaultOffsideLength;
  lastNeighborId = this.defaultOffsideLength;;
  leftMiddleNeighborId = this.defaultOffsideLength;;
  rightMiddleNeighborId = this.defaultOffsideLength;;
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
    this.neighborPositioning(this.navItems[0]);
  }

  onClickLink(selected) {
    this.router.navigate([`/${selected.url}`]);
  }

  onClickedMenuItem(navItem) {
    this.clickedMenuItem.emit(navItem);
    this.neighborPositioning(navItem);
  }

  neighborPositioning(navItem) {
    this.resetPositions();
    const indexPosition = this.getIndexPositionById(navItem.id);

    if (indexPosition === 0) {
      const leftNeighborIndexPositionForRight = indexPosition + 1;
      this.firstNeighborId  = this.getIdByIndex(leftNeighborIndexPositionForRight);
      return;
    }
    if (indexPosition === (this.navItems.length - 1)) {
      const leftNeighborIndexPositionForLast = indexPosition - 1;
      this.lastNeighborId = this.getIdByIndex(leftNeighborIndexPositionForLast);
      return;
    }

    const leftNeighborIndexPosition = indexPosition - 1;
    const rightNeighborIndexPosition = indexPosition + 1;

    this.leftMiddleNeighborId = this.getIdByIndex(leftNeighborIndexPosition);
    this.rightMiddleNeighborId= this.getIdByIndex(rightNeighborIndexPosition);
  }

  getIndexPositionById(id) {
    return this.navItems.findIndex(item => item.id === id);
  }

  getIdByIndex(index) {
    return this.navItems[index].id;
  }

  resetPositions() {
    this.lastNeighborId = this.defaultOffsideLength;
    this.firstNeighborId = this.defaultOffsideLength;
    this.leftMiddleNeighborId = this.defaultOffsideLength;
    this.rightMiddleNeighborId= this.defaultOffsideLength;
  }

}
