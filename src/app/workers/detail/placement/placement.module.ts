import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlacementPageRoutingModule } from './placement-routing.module';

import { PlacementPage } from './placement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlacementPageRoutingModule
  ],
  declarations: [PlacementPage]
})
export class PlacementPageModule {}
