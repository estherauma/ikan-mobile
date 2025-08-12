import { HostListener, Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';
import { StorageKeys } from '../../types/api-types';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(
    public sharedMethods: SharedmethodsService
  ) { }

  enableCollecion() {
    FirebaseAnalytics.setCollectionEnabled({ enabled: true });
  }

  async trackEvent(eventName: string, params?: any) {
    const hasInternet = await this.sharedMethods.checkInternetConnectionStatus();
    if (hasInternet) {
      await FirebaseAnalytics.logEvent({
        name: eventName,
        params
      });
    } else {
      // save to local storage if no internet
      const storedEvents = await this.sharedMethods.readDataFromStorage(StorageKeys.offlineAnalyticsEvents);
      const events = storedEvents?.length ? storedEvents : [];
      events.push({ name: eventName, params });
      await this.sharedMethods.saveDataToStorage(StorageKeys.offlineAnalyticsEvents, events);
    }
  }

  async uploadOfflineEvents() {
    const hasInternet = await this.sharedMethods.checkInternetConnectionStatus();
    if (!hasInternet) { return; }

    const offlineEvents = await this.sharedMethods.readDataFromStorage(StorageKeys.offlineAnalyticsEvents);
    if (offlineEvents?.length) {
      const failedEvents = [];
      for (const event of offlineEvents) {
        await FirebaseAnalytics.logEvent(event).catch(() => {
          failedEvents.push(event);
        });
      }

      // Save failed events
      if (failedEvents) {
        await this.sharedMethods.saveDataToStorage(StorageKeys.offlineAnalyticsEvents, failedEvents);
      }
    }
  }

  @HostListener('window:online', ['$event'])
  onOnline() {
    this.uploadOfflineEvents();
  }
}
