import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordResetSuccessPage } from './password-reset-success.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordResetSuccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordResetSuccessPageRoutingModule {}
