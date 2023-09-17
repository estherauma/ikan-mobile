import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RequestPasswordResetComponent } from "./request-password-reset.component";

const routes: Routes = [
  {
    path: '',
    component: RequestPasswordResetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestPasswordResetComponentRoutingModule {}
