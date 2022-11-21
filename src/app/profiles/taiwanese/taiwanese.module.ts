import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TwaiwanesePageRoutingModule } from './taiwanese-routing.module';

import { SharedModule } from 'src/app/shared/shared.modules';
import { TaiwanesePage } from './taiwanese.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TwaiwanesePageRoutingModule,
    SharedModule
  ],
  declarations: [TaiwanesePage]
})
export class TwaiwanesePageModule {}
