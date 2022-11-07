import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HowToSignupPage } from './how-to-signup.page';

const routes: Routes = [
  {
    path: '',
    component: HowToSignupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HowToSignupPageRoutingModule {}
