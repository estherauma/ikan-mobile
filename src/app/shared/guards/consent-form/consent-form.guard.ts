import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { SharedmethodsService } from '../../services/sharedmethods/sharedmethods.service';
import { StorageKeys } from '../../types/api-types';

@Injectable({
  providedIn: 'root'
})
export class ConsentFormGuard implements CanActivate {

  constructor(
    private sharedMethods: SharedmethodsService,
    private router: Router,
  ) { }

  async canActivate(): Promise<UrlTree | boolean> {
    const completedConsentForm = await this.sharedMethods.readDataFromStorage(StorageKeys.completedConsentForms);
    if (!completedConsentForm) {
      return this.router.parseUrl('/consent-forms');
    }

    return true;
  }
}
