import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import * as Sentry from "@sentry/angular-ivy";

import { TunaModule } from './app/app.module';
import { env } from './environments/environment';

if (env.environment !== 'development') {
  Sentry.init({
    dsn: env.sentryDSN,
    environment: env.environment,
    integrations: [
      new Sentry.BrowserTracing(),
    ],
    tracesSampleRate: 1.0,
  });
}


if (env.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(TunaModule)
  .catch(err => console.log(err));

defineCustomElements(window);
