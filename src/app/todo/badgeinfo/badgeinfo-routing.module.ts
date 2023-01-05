import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BadgeinfoPage } from './badgeinfo.page';

const routes: Routes = [
  {
    path: '',
    component: BadgeinfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BadgeinfoPageRoutingModule {}
