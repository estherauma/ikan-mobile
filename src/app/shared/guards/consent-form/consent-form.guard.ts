import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
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
  
  async canActivate(): Promise<boolean> {
    const completedConsentForm = await this.sharedMethods.readDataFromStorage(StorageKeys.completedConsentForms);

    if (!completedConsentForm) {
      this.router.navigate(['/consent-forms'], { replaceUrl: true });
      return false;
    }

    return true;
  }
  
}
