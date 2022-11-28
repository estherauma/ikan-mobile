import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateDetailPage } from './createdetail.page';

const routes: Routes = [
  {
    path: '',
    component: CreateDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePageRoutingModule {}
