import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaiwaneseagentPageRoutingModule } from './taiwaneseagent-routing.module';

import { TaiwaneseagentPage } from './taiwaneseagent.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaiwaneseagentPageRoutingModule,
    SharedModule
  ],
  declarations: [TaiwaneseagentPage]
})
export class TaiwaneseagentPageModule {}
