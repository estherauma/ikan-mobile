import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VesselownerPageRoutingModule } from './vesselowner-routing.module';

import { VesselownerPage } from './vesselowner.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VesselownerPageRoutingModule,
    SharedModule
  ],
  declarations: [VesselownerPage]
})
export class VesselownerPageModule {}
