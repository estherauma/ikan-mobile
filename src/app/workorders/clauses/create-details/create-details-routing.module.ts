import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateDetailsPage } from './create-details.page';

const routes: Routes = [
  {
    path: '',
    component: CreateDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateDetailsPageRoutingModule {}
