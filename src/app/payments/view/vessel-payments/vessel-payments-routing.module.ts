import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { VesselPaymentsPage } from './vessel-payments.page';

const routes: Routes = [
  {
    path: '',
    component: VesselPaymentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VesselPaymentsPageRoutingModule {}
