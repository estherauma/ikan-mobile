import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


export type StatusType = 'pending' | 'active';
@Component({
  selector: 'app-pageprofilecontainer',
  templateUrl: './pageprofilecontainer.component.html',
  styleUrls: ['./pageprofilecontainer.component.scss'],
})
export class PageprofilecontainerComponent implements OnInit {
  @Input() imageUrl = 'https://cdn.pixabay.com/photo/2016/11/30/20/44/computer-1873831_1280.png';
  @Input() navItems = [];
  @Input() active = this.navItems.length && this.navItems[0];
  @Input() status: StatusType = 'pending';
  @Input() title = '';
  @Input() isResendInviteBtn = false;

  reSendInviteBtnTitle = 'Re-send invite';

  @Output() clickedMenuItem = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {}

  onClickedMenu(data) {
    this.clickedMenuItem.emit(data);
  }

}
