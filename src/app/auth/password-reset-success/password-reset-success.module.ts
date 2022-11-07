import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordResetSuccessPageRoutingModule } from './password-reset-success-routing.module';

import { PasswordResetSuccessPage } from './password-reset-success.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswordResetSuccessPageRoutingModule
  ],
  declarations: [PasswordResetSuccessPage]
})
export class PasswordResetSuccessPageModule {}
