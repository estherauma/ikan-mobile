import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseformPage } from './baseform.page';

const routes: Routes = [
  {
    path: '',
    component: BaseformPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaseformPageRoutingModule {}
