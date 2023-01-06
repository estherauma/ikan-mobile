import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClausesPage } from './clauses.page';

const routes: Routes = [
  {
    path: '',
    component: ClausesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClausesPageRoutingModule {}
