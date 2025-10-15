import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WageDetailComponent } from "./wage-detail.component";

const routes: Routes = [
  {
    path: '',
    component: WageDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WageDetailRoutingModule {}
