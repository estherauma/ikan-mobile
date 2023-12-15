import { ErrorHandler, Injectable } from '@angular/core';
import * as Sentry from '@sentry/angular-ivy';
import { App } from '@capacitor/app';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor() {
    // add release to Sentry
    // code will only run on device
    App.getInfo().then((info) => {;
      const newOptions: Sentry.BrowserOptions = {
        release: info?.version,
      };
      const currentOptions = Sentry.getCurrentHub().getClient().getOptions();
      const updatedOptions: Sentry.BrowserOptions = { ...currentOptions, ...newOptions };
      Sentry.init(updatedOptions);
    });
  }

  handleError(error: any, customErrMsg = ''): void {
    Sentry.captureException(error, (scope) => {
      scope.setTransactionName(customErrMsg);
      return scope;
    });
  }
}
