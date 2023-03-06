import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VariantPageRoutingModule } from './variant-routing.module';

import { VariantPage } from './variant.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VariantPageRoutingModule,
    SharedModule
  ],
  declarations: [VariantPage]
})
export class VariantPageModule {}
