
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.modules';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

/** This is used to make sqlite work with the emulator. */
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

/** This is used to make sqlite work with the browser. */
import { SQLiteMock } from './shared/services/database/sqlite.mock';
import { RedElDirective } from './red-el.directive';

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
  ],
  exports: [

  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    /** Uncomment next line for native builds */
    // { provide: SQLite },

    /** We use SQLiteMock for testing in the browser */
    { provide: SQLite, useClass: SQLiteMock },

  ],
  bootstrap: [AppComponent],
})


export class TunaModule {}
