import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { SharedmethodsService } from '../../services/sharedmethods/sharedmethods.service';
import { StorageKeys } from '../../types/api-types';

@Injectable({
  providedIn: 'root'
})
export class TutorialsGuard implements CanActivate {

  constructor(
    private sharedMethods: SharedmethodsService,
    private router: Router,
  ) { }

  async canActivate(): Promise<boolean | UrlTree> {
    const skippedAppTutorials = await this.sharedMethods.readDataFromStorage(StorageKeys.skippedAppTutorials);
    const seenAppTutorials = await this.sharedMethods.readDataFromStorage(StorageKeys.seenAppTutorials);
    if (!skippedAppTutorials && !seenAppTutorials) {
      return this.router.parseUrl('/app-tutorials');
    }

    return true;
  }

}
