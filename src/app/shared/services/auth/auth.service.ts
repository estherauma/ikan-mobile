import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { StorageKeys, UserData, UserRole } from '../../types/api-types';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userToken: string;
  userData: UserData;
  userRole: string;
  tokenExpiryDate: Date;
  currentUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor(
    public sharedMethods: SharedmethodsService
  ) {
    this.setUpAuthData();
    this.getUser().subscribe((data) => {
      if (data && Object.keys(data).length > 0) {
        this.userData = data;
        this.userRole = data.role;
      }
    });
  }

  async setUpAuthData() {
    this.userData = await this.sharedMethods.readDataFromStorage(StorageKeys.userData);
    if (this.userData) {
      this.userRole = this.userData?.role;
      this.currentUser.next(this.userData);
  
      this.userToken = await this.sharedMethods.readDataFromStorage(StorageKeys.apiToken);
      if (this.userToken) {
        const decodedAccessToken = this.decodeAccessToken(this.userToken);
        this.tokenExpiryDate = new Date(0);
        this.tokenExpiryDate.setUTCSeconds(decodedAccessToken.exp);
      }
    }
  }


  getCurrentUserBaseUrlFromRole(userRole: string) {
    switch (userRole) {
      case UserRole.taiwaneseAgent:
        return 'dashboard/taiwaneseagent';
      case UserRole.worker:
        return 'dashboard/worker';
      case UserRole.vesselOwner:
        return 'dashboard/vesselowner';
      case UserRole.indonesianAgent:
        return 'dashboard/indonesianagent';
      case UserRole.buyer:
        return 'dashboard/buyer';
      default:
        this.sharedMethods.showToast('Invalid user role');
        return '';
    }
  }

  decodeAccessToken(accessToken) {
    return JSON.parse(window.atob(accessToken?.split('.')?.[1]));
  }

  getUser() {
    return this.currentUser.asObservable();
  }

  logOut() {
    Preferences.remove({ key: StorageKeys.apiToken });
    Preferences.remove({ key: StorageKeys.userData });
    Preferences.remove({ key: StorageKeys.isRoleSet });
    Preferences.remove({ key: StorageKeys.currentUserOnlineContractsAppRefs });
  }

  alterMenuBasedOnRole(menuItems: Array<any>) {
    let finalMenu = [];
    menuItems.forEach((menuItem) => {
      // show change role based on number of user roles
      if(this.userData?.roles?.length > 1 && menuItem.url === '/select-role') {
        menuItem.enabled = true;
      }
      if (menuItem?.roles == null) {
        return;
      }
      let allowedRoles = menuItem.roles.split(',').map((role) => role.trim());
      if (menuItem?.enabled && (allowedRoles.includes(this.userRole) || allowedRoles.includes('all'))) {
       finalMenu.push(menuItem);
      }
    })
    return finalMenu;
  }

  async checkAcessTokenValidity() {
    const value = await this.sharedMethods.readDataFromStorage(StorageKeys.apiToken);
    if (!value) {
      return false;
    }

    const now = new Date().toUTCString();
    if ( this.tokenExpiryDate < new Date(now)) {
      return false;
    }

    return true;
  }
}
