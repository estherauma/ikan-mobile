import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SteptwoPageRoutingModule } from './steptwo-routing.module';

import { SteptwoPage } from './steptwo.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SteptwoPageRoutingModule,
    SharedModule
  ],
  declarations: [SteptwoPage]
})
export class SteptwoPageModule {}
