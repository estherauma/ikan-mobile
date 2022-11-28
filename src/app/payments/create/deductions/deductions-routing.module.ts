import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeductionsPage } from './deductions.page';

const routes: Routes = [
  {
    path: '',
    component: DeductionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeductionsPageRoutingModule {}
