import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArchivedWoPageRoutingModule } from './archived-wo-routing.module';

import { ArchivedWoPage } from './archived-wo.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArchivedWoPageRoutingModule,
    SharedModule
  ],
  declarations: [ArchivedWoPage]
})
export class ArchivedWoPageModule {}
