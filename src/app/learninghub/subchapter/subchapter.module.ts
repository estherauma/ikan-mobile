import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '@fiftyeight/shared-components';

import { SubchapterRoutingModule } from './subchapter-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.modules';
import { SubchapterComponent } from './subchapter.component';


@NgModule({
  declarations: [ SubchapterComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SubchapterRoutingModule,
    SharedComponentsModule,
  ]
})
export class SubchapterModule { }
