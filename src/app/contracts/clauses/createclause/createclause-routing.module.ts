import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateclausePage } from './createclause.page';

const routes: Routes = [
  {
    path: '',
    component: CreateclausePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateclausePageRoutingModule {}
