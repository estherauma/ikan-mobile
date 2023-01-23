import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SandboxPageRoutingModule } from './sandbox-routing.module';

import { SandboxPage } from './sandbox.page';
import { SharedModule } from '../shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SandboxPageRoutingModule,
    SharedModule
  ],
  declarations: [SandboxPage]
})
export class SandboxPageModule {}
