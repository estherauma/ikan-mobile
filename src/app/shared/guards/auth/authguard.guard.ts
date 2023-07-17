import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { SharedmethodsService } from '../../services/sharedmethods/sharedmethods.service';
import { StorageKeys, UserData } from '../../types/api-types';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  userRole: string;
  constructor(
    public authService: AuthService,
    public sharedMethods: SharedmethodsService
  ) { 
    
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(route.url[0].path);
    console.log(state.url);
    console.log(this.authService.userRole);
    if (this.userRole == 'vsesl')
    return true;
  }

  commonRoutes = [];
  commonActions = [];

  vesselOwnerRouotes = [
    'workorders/home'
  ];
  vesselOwnerActions = [];

  taiwaneseAgentRoutes = [];
  taiwaneseAgentActions = [];

  indonesianAgentRoutes = [];
  indonedianAgentActions = [];

  workerRoutes = [];
  workerActions = [];

  buyerRoutes = [];
  buyerActions = [];

  adminRoutes = [];
  adminActions = [];

}