import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatepassportPage } from './createpassport.page';

const routes: Routes = [
  {
    path: '',
    component: CreatepassportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatepassportPageRoutingModule {}
