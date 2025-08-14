import { Component, Input, OnInit } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { SharedmethodsService } from '../../services/sharedmethods/sharedmethods.service';
import { AuthService } from '../../services/auth/auth.service';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() showBackButton = true;
  @Input() showMenuButton = true;
  @Input() showGetHelp = true;
  @Input() backBtnText = '';
  @Input() isLightBlueBg = false;

  defaultHref = '';
  commonText: any;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public authService: AuthService,
    public menuController: MenuController,
    public router: Router
  ) { }

  async ngOnInit() {
    this.commonText = this.contentService.commonText;
    const user = await this.sharedMethods.getUserData();
    if (user) {
      const dashboard = this.authService.getCurrentUserBaseUrlFromRole(user?.role);
      this.defaultHref = dashboard ?? this.defaultHref;
    }
  }

  async openMenu() {
    await this.menuController.open();
  }

  goToHelp() {
    this.router.navigate(['help']);
  }
}
