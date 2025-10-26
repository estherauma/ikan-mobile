import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { VesselWagesComponent } from "./vessel-wages.component";

const routes: Routes = [
  {
    path: '',
    component: VesselWagesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VesselWagesRoutingModule {}
