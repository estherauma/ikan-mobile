import { Component, OnInit } from '@angular/core';
import { StatusType } from 'src/app/shared/components/pageprofilecontainer/pageprofilecontainer.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  navItems = [
    { name: 'Info', url: 'workers/info', id: 1 },
    { name: 'Payment', url: 'workers/payment', id: 2  },
    { name: 'Placement', url: 'workers/placement', id: 3  },
    { name: 'Documents', url: 'workers/documents', id: 4  },
    { name: 'Training', url: 'workers/training', id: 5  }
  ];
  activeNavItem = this.navItems[0];
  isResendInviteBtn = this.activeNavItem.id === 1;

  profile = {
    name: 'Budi Surname',
    status: 'pending' as StatusType
  };

  constructor() { }

  ngOnInit() {
  }

  getParams() {}

  onClickedMenu(menuItem) {
    this.activeNavItem = menuItem;
    if (menuItem.id === 1) {
      this.isResendInviteBtn = true;
    } else {
      this.isResendInviteBtn = false;
    }
  }

}
