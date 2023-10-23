import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreatedetailPageRoutingModule } from './createdetail-routing.module';
import { CreatedetailPage } from './createdetail.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatedetailPageRoutingModule,
    SharedModule
  ],
  declarations: [CreatedetailPage]
})
export class CreatedetailPageModule {}
