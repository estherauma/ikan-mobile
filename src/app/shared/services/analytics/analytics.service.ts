import { Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  enableCollecion() {
    FirebaseAnalytics.setCollectionEnabled({ enabled: true });
  }

  async trackEvent(eventName: string, params?: any) {
    await FirebaseAnalytics.logEvent({
      name: eventName,
      params: params
    });
  }
}
