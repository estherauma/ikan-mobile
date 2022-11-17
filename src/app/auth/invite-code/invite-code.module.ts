import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InviteCodePageRoutingModule } from './invite-code-routing.module';

import { InviteCodePage } from './invite-code.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InviteCodePageRoutingModule,
    SharedModule
  ],
  declarations: [InviteCodePage]
})
export class InviteCodePageModule {}
