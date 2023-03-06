import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateDetailsPageRoutingModule } from './create-details-routing.module';

import { CreateDetailsPage } from './create-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateDetailsPageRoutingModule
  ],
  declarations: [CreateDetailsPage]
})
export class CreateDetailsPageModule {}
