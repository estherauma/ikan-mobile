import { Injectable } from '@angular/core';
import { AppContent } from '../../types/api-types';
import { ApiService } from '../api/api.service';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(
    public apiService: ApiService,
    public sharedMethods: SharedmethodsService) { }

  async fetchContent() {
    const content = this.apiService.get('content/aggregated');
    content.subscribe((data: AppContent) => {
      if (data?.status === 'OK') {
        // this
      }
    });
  }

  async readLocalContent() {

  }

  async writeLocalContent() {

  }
}
