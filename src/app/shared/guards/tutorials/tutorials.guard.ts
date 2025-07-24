import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
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

  async canActivate(): Promise<boolean> {
    const skippedAppTutorials = await this.sharedMethods.readDataFromStorage(StorageKeys.skippedAppTutorials);
    const seenAppTutorials = await this.sharedMethods.readDataFromStorage(StorageKeys.seenAppTutorials);
    if (!skippedAppTutorials && !seenAppTutorials) {
      this.router.navigate(['app-tutorials']);
      return false;
    }

    return true;
  }

}
