import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.modules';
import { PaymentDetailsPage } from './payment-details.page';
import { PaymentDetailsPageRoutingModule } from './payment-details-routing.module';



@NgModule({
  declarations: [PaymentDetailsPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PaymentDetailsPageRoutingModule,
  ]
})
export class PaymentDetailsModule { }
