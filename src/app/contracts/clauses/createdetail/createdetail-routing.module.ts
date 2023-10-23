import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatedetailPage } from './createdetail.page';

const routes: Routes = [
  {
    path: '',
    component: CreatedetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatedetailPageRoutingModule {}
