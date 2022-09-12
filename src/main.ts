import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { TunaModule } from './app/app.module';
import { env } from './environments/environment';

if (env.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(TunaModule)
  .catch(err => console.log(err));
