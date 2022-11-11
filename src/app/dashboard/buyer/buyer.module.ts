import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyerPageRoutingModule } from './buyer-routing.module';

import { BuyerPage } from './buyer.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyerPageRoutingModule,
    SharedModule
  ],
  declarations: [BuyerPage]
})
export class BuyerPageModule {}
