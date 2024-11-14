import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VesselPaymentsPageRoutingModule } from './vessel-payments-routing.module';
import { SharedModule } from 'src/app/shared/shared.modules';
import { VesselPaymentsPage } from './vessel-payments.page';



@NgModule({
  declarations: [ VesselPaymentsPage ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VesselPaymentsPageRoutingModule,
    SharedModule,
  ]
})
export class VesselPaymentsModule { }
