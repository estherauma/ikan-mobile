import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EssentialsComponent } from "./essentials.component";

const routes: Routes = [
  {
    path: "",
    component: EssentialsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EssentialsRoutingModule {}
