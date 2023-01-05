import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BadgesPageRoutingModule } from './badges-routing.module';

import { BadgesPage } from './badges.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BadgesPageRoutingModule,
    SharedModule
  ],
  declarations: [BadgesPage]
})
export class BadgesPageModule {}
