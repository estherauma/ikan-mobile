import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsernameLoginPageRoutingModule } from './username-login-routing.module';

import { UsernameLoginPage } from './username-login.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsernameLoginPageRoutingModule,
    SharedModule
  ],
  declarations: [UsernameLoginPage]
})
export class UsernameLoginPageModule {}
