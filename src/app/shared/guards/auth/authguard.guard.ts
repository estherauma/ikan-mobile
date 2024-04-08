import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { SharedmethodsService } from '../../services/sharedmethods/sharedmethods.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {

  userRole: string;

  // Roles and actions
  commonRoutes = [];
  commonActions = [];

  vesselOwnerRoutes = [
    '/workorders/home'
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
  constructor(
    public authService: AuthService,
    public sharedMethods: SharedmethodsService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // TODO: We will use the path later.
    // const currentPath = route.url[0].path;
    const currentState = state.url;

    // TODO: When we start doing this for all roles, we might have to split this into different functions
    if (this.authService.userRole === 'vessel_owner') {
      //check if current state is in vessle owner routes
      if (this.vesselOwnerRoutes.includes(currentState)) {
        return true;
      }
      return true;
    }
    // Once we've added all route and actions, we'll deny access to all routes by default
    // Otherwise none of the routes will load
    return true;
  }
}
