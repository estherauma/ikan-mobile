import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SteptwoPage } from './steptwo.page';

const routes: Routes = [
  {
    path: '',
    component: SteptwoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SteptwoPageRoutingModule {}
