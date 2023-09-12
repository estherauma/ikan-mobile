import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RequestPasswordResetComponentRoutingModule } from './request-password-reset-routing.module';
import { SharedModule } from 'src/app/shared/shared.modules';
import { RequestPasswordResetComponent } from './request-password-reset.component';



@NgModule({
  declarations: [RequestPasswordResetComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestPasswordResetComponentRoutingModule,
    SharedModule
  ]
})
export class RequestPasswordResetModule { }
