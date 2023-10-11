import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateclausePageRoutingModule } from './createclause-routing.module';

import { CreateclausePage } from './createclause.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateclausePageRoutingModule
  ],
  declarations: [CreateclausePage]
})
export class CreateclausePageModule {}
