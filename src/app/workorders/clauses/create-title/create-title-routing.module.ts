import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateTitlePage } from './create-title.page';

const routes: Routes = [
  {
    path: '',
    component: CreateTitlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateTitlePageRoutingModule {}
