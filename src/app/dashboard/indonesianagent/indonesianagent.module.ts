import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IndonesianagentPageRoutingModule } from './indonesianagent-routing.module';

import { IndonesianagentPage } from './indonesianagent.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IndonesianagentPageRoutingModule,
    SharedModule
  ],
  declarations: [IndonesianagentPage]
})
export class IndonesianagentPageModule {}
