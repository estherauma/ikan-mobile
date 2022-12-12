import { Injectable } from '@angular/core';
import { UserRole } from 'src/app/shared/types/api-types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getCurrentUserBaseUrlFromRole(userRole: string){
    switch(userRole){
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
}
