import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VerifyCodeComponent } from './verify-code.component';
import { VerifyCodeRoutingModule } from './verify-code-routing.module';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyCodeRoutingModule,
    SharedModule,
  ],
  declarations: [
    VerifyCodeComponent
  ],
})
export class VerifyCodeModule {}
