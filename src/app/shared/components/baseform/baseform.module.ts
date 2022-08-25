import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BaseformPageRoutingModule } from './baseform-routing.module';

import { BaseformPage } from './baseform.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BaseformPageRoutingModule
  ],
  declarations: [BaseformPage]
})
export class BaseformPageModule {}
