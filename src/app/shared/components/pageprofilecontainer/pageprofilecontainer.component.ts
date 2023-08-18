import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContentService } from '../../services/content/content.service';


export type StatusType = 'pending' | 'active';
@Component({
  selector: 'app-pageprofilecontainer',
  templateUrl: './pageprofilecontainer.component.html',
  styleUrls: ['./pageprofilecontainer.component.scss'],
})
export class PageprofilecontainerComponent implements OnInit {
  commonText: any;
  reSendInviteBtnTitle = 'Re-send invite';

  @Input() imageUrl = '';
  @Input() navItems = [];
  @Input() active = this.navItems.length && this.navItems[0];
  @Input() status: StatusType = 'pending';
  @Input() title = '';
  @Input() isResendInviteBtn = false;
  @Input() withinNav = true;

  @Output() clickedMenuItem = new EventEmitter<any>();

  constructor(
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.reSendInviteBtnTitle = this.commonText?.resendInvite;
  }

  onClickedMenu(data) {
    this.clickedMenuItem.emit(data);
  }

}
