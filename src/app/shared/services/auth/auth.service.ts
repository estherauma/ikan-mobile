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
  }

  alterMenuBaseOnRole(menuItems) {
    let finalMenu = []
    finalMenu.push({label: 'Sync', url: '/sync', icon: 'sync', role:'all', enabled: true, position: 399});
    menuItems.forEach((menuItem) => {
      if (menuItem?.roles == null) {
        return;
      }
      let allowedRoles = menuItem.roles.split(',');
      if (allowedRoles.includes(this.userRole) || allowedRoles.includes('all')) {
       finalMenu.push(menuItem);
      }
    })
    return finalMenu;
  }  

}
