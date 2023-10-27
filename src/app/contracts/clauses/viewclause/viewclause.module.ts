import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewclausePageRoutingModule } from './viewclause-routing.module';

import { ViewclausePage } from './viewclause.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewclausePageRoutingModule,
    SharedModule
  ],
  declarations: [ViewclausePage]
})
export class ViewclausePageModule {}
