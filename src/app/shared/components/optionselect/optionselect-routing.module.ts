import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OptionselectPage } from './optionselect.page';

const routes: Routes = [
  {
    path: '',
    component: OptionselectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OptionselectPageRoutingModule {}
