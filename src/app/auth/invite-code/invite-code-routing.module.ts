import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InviteCodePage } from './invite-code.page';

const routes: Routes = [
  {
    path: '',
    component: InviteCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InviteCodePageRoutingModule {}
