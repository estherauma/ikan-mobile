import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WageTrackingHelpComponent } from "./wage-tracking-help.component";

const routes: Routes = [
  {
    path: '',
    component: WageTrackingHelpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WageTrackingHelpRoutingModule {}
