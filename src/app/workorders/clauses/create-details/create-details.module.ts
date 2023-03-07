import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateDetailsPageRoutingModule } from './create-details-routing.module';

import { CreateDetailsPage } from './create-details.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateDetailsPageRoutingModule,
    SharedModule
  ],
  declarations: [CreateDetailsPage]
})
export class CreateDetailsPageModule {}
