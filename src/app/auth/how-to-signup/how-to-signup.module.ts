import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HowToSignupPageRoutingModule } from './how-to-signup-routing.module';

import { HowToSignupPage } from './how-to-signup.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HowToSignupPageRoutingModule,
    SharedModule
  ],
  declarations: [HowToSignupPage]
})
export class HowToSignupPageModule {}
