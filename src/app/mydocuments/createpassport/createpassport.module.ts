import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatepassportPageRoutingModule } from './createpassport-routing.module';

import { CreatepassportPage } from './createpassport.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatepassportPageRoutingModule,
    SharedModule
  ],
  declarations: [CreatepassportPage]
})
export class CreatepassportPageModule {}
