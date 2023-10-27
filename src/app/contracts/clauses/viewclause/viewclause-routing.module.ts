import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewclausePage } from './viewclause.page';

const routes: Routes = [
  {
    path: '',
    component: ViewclausePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewclausePageRoutingModule {}
