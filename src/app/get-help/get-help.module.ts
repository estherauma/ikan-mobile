import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetHelpComponent } from './get-help.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.modules';
import { GetHelpRoutingModule } from './get-help-routing.module';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from '@fiftyeight/shared-components';



@NgModule({
  declarations: [ GetHelpComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    GetHelpRoutingModule,
    SharedComponentsModule,
  ]
})
export class GetHelpModule { }
