import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VesselWagesComponent } from './vessel-wages.component';
import { VesselWagesRoutingModule } from './vessel-wages-routing.module';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VesselWagesRoutingModule,
    SharedModule
  ],
  declarations: [VesselWagesComponent],
})
export class VesselWagesModule {}
