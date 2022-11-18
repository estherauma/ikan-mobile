import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndonesianagentPage } from './indonesianagent.page';

const routes: Routes = [
  {
    path: '',
    component: IndonesianagentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndonesianagentPageRoutingModule {}
