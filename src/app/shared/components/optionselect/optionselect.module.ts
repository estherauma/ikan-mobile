import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OptionselectPageRoutingModule } from './optionselect-routing.module';

import { OptionselectPage } from './optionselect.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OptionselectPageRoutingModule
  ],
  declarations: [OptionselectPage]
})
export class OptionselectPageModule {}
