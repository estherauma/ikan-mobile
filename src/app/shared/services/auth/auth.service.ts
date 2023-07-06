import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { StorageKeys, UserData, UserRole } from '../../types/api-types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tokenExpiry: Date;
  userRole: string;
  currentUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }

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
        return '';
    }
  }

  decodeAccessToken(accessToken) {
    return JSON.parse(window.atob(accessToken.split('.')[1]));
  }

  getUser() {
    return this.currentUser.asObservable();
  }

  logOut() {
    Preferences.remove({ key: StorageKeys.apiToken });
    Preferences.remove({ key: StorageKeys.apiTokenExpiry });
    // TODO: Navigation should happen in the component itself
    // this.router.navigate(['/login']);
  }

  hasPermission(permissions: string[]): boolean {
    for (const permission of permissions) {
      if (!this.currentUser.value || !this.currentUser.value.permissions.includes(permission)) {
        return false;
      }
    }
    return true;
  }
}
