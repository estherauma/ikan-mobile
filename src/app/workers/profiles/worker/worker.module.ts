import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkerPageRoutingModule } from './worker-routing.module';

import { WorkerPage } from './worker.page';
import { SharedModule } from 'src/app/shared/shared.modules';
import { InfoPage as WorkerProfile } from './info/info.page';
import { PaymentsPage } from './payments/payments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkerPageRoutingModule,
    SharedModule
  ],
  declarations: [
    WorkerPage,
    WorkerProfile,
    PaymentsPage
  ],
})
export class WorkerPageModule {}
