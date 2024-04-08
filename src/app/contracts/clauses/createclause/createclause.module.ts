import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateclausePageRoutingModule } from './createclause-routing.module';

import { CreateclausePage } from './createclause.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateclausePageRoutingModule,
    SharedModule
  ],
  declarations: [CreateclausePage]
})
export class CreateclausePageModule {}
