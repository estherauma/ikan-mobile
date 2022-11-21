import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VesselownerPage } from './vesselowner.page';

const routes: Routes = [
  {
    path: '',
    component: VesselownerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VesselownerPageRoutingModule {}
