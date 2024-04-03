import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys, UserData, UserRole } from 'src/app/shared/types/api-types';

@Component({
  selector: 'app-select-role',
  templateUrl: './select-role.component.html',
  styleUrls: ['./select-role.component.scss'],
})
export class SelectRoleComponent  implements OnInit {
  commonText: any;
  selectRoleOptions: any = [];
  currentRole: string = '';

  constructor(
    public sharedMethods: SharedmethodsService,
    public contentService: ContentService,
    public modalController: ModalController,
    public router: Router,
    public authService: AuthService,

  ) {}

  async ngOnInit() {
    this.commonText = this.contentService.commonText;
    const userData: UserData = await this.sharedMethods.getUserData();
    this.currentRole = userData?.role;
    this.selectRoleOptions = this.generateSelectRoleOptions(userData?.roles);
  }

  generateSelectRoleOptions(userRoles: UserRole[]) {
    return userRoles.map((role) => {
      const key = Object.keys(UserRole).find(key => UserRole[key] === role);
      return {
        label: this.commonText?.[key]|| role,
        value: role,
      };
    });
  }

  async changeRole(event) {
    const userData: UserData = await this.sharedMethods.getUserData();
    userData.role = event?.detail?.value;
    await this.sharedMethods.saveDataToStorage(StorageKeys.userData, userData);
    await this.sharedMethods.saveDataToStorage(StorageKeys.isRoleSet, true);
    await this.authService.setUpAuthData();
    this.contentService.contentObs.next(true);
    this.router.navigate([this.authService.getCurrentUserBaseUrlFromRole(event?.detail?.value)], {replaceUrl: true});
  }
}
