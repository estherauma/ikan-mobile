import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SteponePage } from './stepone.page';

const routes: Routes = [
  {
    path: '',
    component: SteponePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SteponePageRoutingModule {}
