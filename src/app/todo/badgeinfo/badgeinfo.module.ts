import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BadgeinfoPageRoutingModule } from './badgeinfo-routing.module';

import { BadgeinfoPage } from './badgeinfo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BadgeinfoPageRoutingModule
  ],
  declarations: [BadgeinfoPage]
})
export class BadgeinfoPageModule {}
