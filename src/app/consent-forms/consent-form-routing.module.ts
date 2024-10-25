import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ConsentFormsComponent } from "./consent-forms.component";

const routes: Routes = [
  {
    path: '',
    component: ConsentFormsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsentFormsRoutingModule {}
