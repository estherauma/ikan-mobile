
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

import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
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
    { provide: SQLite }
  ],
  bootstrap: [AppComponent],
})


export class TunaModule {}
