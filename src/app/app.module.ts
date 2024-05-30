
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, Router } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.modules';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { RedElDirective } from './red-el.directive';
import { SharedComponentsModule } from '@fiftyeight/shared-components';
import * as Sentry from '@sentry/angular-ivy';
import { GlobalErrorHandlerService } from './shared/services/error-handler/global-error-handler.service';
import { GlobalHttpInterceptor } from './shared/services/error-handler/global-http-interceptor/global-http-interceptor';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';

@NgModule({
  declarations: [ AppComponent, RedElDirective ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    CommonModule,
    SharedComponentsModule,
  ],
  exports: [

  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: SQLite },
    { provide: ErrorHandler, useValue: Sentry.createErrorHandler({ showDialog: false }), },
    { provide: Sentry.TraceService, deps: [Router] },
    { provide: APP_INITIALIZER, useFactory: () => () => { }, deps: [Sentry.TraceService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: GlobalHttpInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    Chooser,
    FileOpener,
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})


export class TunaModule {}
