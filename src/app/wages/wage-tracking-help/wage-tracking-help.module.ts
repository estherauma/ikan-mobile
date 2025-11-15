import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WageTrackingHelpComponent } from './wage-tracking-help.component';
import { WageTrackingHelpRoutingModule } from './wage-tracking-help-routing.module';
import { SharedModule } from 'src/app/shared/shared.modules';



@NgModule({
  declarations: [WageTrackingHelpComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WageTrackingHelpRoutingModule,
    SharedModule,
  ],
})
export class WageTrackingHelpModule { }
