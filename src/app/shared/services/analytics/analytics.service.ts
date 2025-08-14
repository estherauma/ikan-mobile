import { Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';
import { StorageKeys } from '../../types/api-types';
import { GlobalErrorHandlerService } from '../error-handler/global-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(
    public sharedMethods: SharedmethodsService,
    public globalErrorHandler: GlobalErrorHandlerService,
  ) { }

  enableCollecion() {
    FirebaseAnalytics.setCollectionEnabled({ enabled: true });
  }

  async trackEvent(eventName: string, params?: any) {
    const isValidEventName = this.isValidEventName(eventName);
    if (!isValidEventName) {
      this.globalErrorHandler.handleError(
        null,
        `The event name: ${eventName} is invalid. Please check that the event \
        name is less than 40 characters long, only uses these characters(a-z, A-Z, 0-9, underscore (_)), \
        does not start with a number and is not a reserved firebase event name.`
      );
    }

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

  isValidEventName(eventName) {
    if (typeof eventName !== 'string') {return false;}

    const regex = /^[A-Za-z_][A-Za-z0-9_]{0,39}$/;
    return regex.test(eventName);
  }
}
