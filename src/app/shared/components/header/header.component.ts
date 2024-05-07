import { Component, Input, OnInit } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { SharedmethodsService } from '../../services/sharedmethods/sharedmethods.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() pageTitle: string;
  @Input() isBackButton = true;
  @Input() isMenuButton = true;
  @Input() backBtnText = '';
  @Input() isLightBlueBg = false;

  backText = '';
  defaultHref = '';

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public authService: AuthService,
  ) { }

  async ngOnInit() {
    this.backText = this.contentService.commonText?.back;
    const user = await this.sharedMethods.getUserData();
    if (user) {
      const dashboard = this.authService.getCurrentUserBaseUrlFromRole(user?.role);
      console.log('dashboard------', dashboard)
      this.defaultHref = dashboard ?? this.defaultHref;
    }

  }

}
