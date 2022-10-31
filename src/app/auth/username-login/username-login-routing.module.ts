import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsernameLoginPage } from './username-login.page';

const routes: Routes = [
  {
    path: '',
    component: UsernameLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsernameLoginPageRoutingModule {}
