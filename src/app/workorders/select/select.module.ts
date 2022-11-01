import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectPageRoutingModule } from './select-routing.module';

import { SelectPage } from './select.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectPageRoutingModule,
    SharedModule
  ],
  declarations: [SelectPage]
})
export class SelectPageModule {}
