import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignatureviewPageRoutingModule } from './signatureview-routing.module';

import { SignatureviewPage } from './signatureview.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignatureviewPageRoutingModule,
    SharedModule,
  ],
  declarations: [SignatureviewPage]
})
export class SignatureviewPageModule {}
