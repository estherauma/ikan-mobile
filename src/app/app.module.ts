import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  ErrorHandler,
  APP_INITIALIZER,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, Router } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.modules';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { RedElDirective } from './red-el.directive';
import { SharedComponentsModule } from '@fiftyeight/shared-components';
import * as Sentry from '@sentry/angular-ivy';
import { GlobalErrorHandlerService } from './shared/services/error-handler/global-error-handler.service';
import { GlobalHttpInterceptor } from './shared/services/error-handler/global-http-interceptor/global-http-interceptor';

@NgModule({
  declarations: [AppComponent, RedElDirective],
  exports: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ innerHTMLTemplatesEnabled: true }),
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CommonModule,
    SharedComponentsModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: SQLite },
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({ showDialog: false }),
    },
    { provide: Sentry.TraceService, deps: [Router] },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptor,
      multi: true,
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class TunaModule {}
