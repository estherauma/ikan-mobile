import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArchivedWoPage } from './archived-wo.page';

const routes: Routes = [
  {
    path: '',
    component: ArchivedWoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArchivedWoPageRoutingModule {}
