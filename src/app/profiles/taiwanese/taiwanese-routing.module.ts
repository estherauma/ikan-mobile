import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaiwanesePage } from './taiwanese.page';

const routes: Routes = [
  {
    path: '',
    component: TaiwanesePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TwaiwanesePageRoutingModule {}
