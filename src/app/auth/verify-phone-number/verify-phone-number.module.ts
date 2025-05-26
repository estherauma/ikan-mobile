import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VerifyPhoneNumberRoutingModule } from './verify-phone-number-routing.module';
import { VerifyPhoneNumberComponent } from './verify-phone-number.component';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
      CommonModule,
      FormsModule,
      IonicModule,
      VerifyPhoneNumberRoutingModule,
      SharedModule,
      ReactiveFormsModule,
    ],
  declarations: [
    VerifyPhoneNumberComponent
  ],
})
export class VerifyPhoneNumberModule {}
