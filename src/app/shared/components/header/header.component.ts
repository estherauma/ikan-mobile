import { Component, Input, OnInit } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { SharedmethodsService } from '../../services/sharedmethods/sharedmethods.service';
import { AuthService } from '../../services/auth/auth.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() pageTitle: string;
  @Input() isBackButton = true;
  @Input() showMenuButton = true;
  @Input() backBtnText = '';
  @Input() isLightBlueBg = false;

  backText = '';
  defaultHref = '';
  menuText = 'Menu';

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public authService: AuthService,
    public menuController: MenuController,
  ) { }

  async ngOnInit() {
    this.backText = this.contentService.commonText?.back;
    this.menuText = this.contentService.commonText?.menu;
    const user = await this.sharedMethods.getUserData();
    if (user) {
      const dashboard = this.authService.getCurrentUserBaseUrlFromRole(user?.role);
      this.defaultHref = dashboard ?? this.defaultHref;
    }
  }

  async openMenu() {
    await this.menuController.open();
  }
}
