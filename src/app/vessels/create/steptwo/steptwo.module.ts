import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SteptwoPageRoutingModule } from './steptwo-routing.module';

import { SteptwoPage } from './steptwo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SteptwoPageRoutingModule
  ],
  declarations: [SteptwoPage]
})
export class SteptwoPageModule {}
