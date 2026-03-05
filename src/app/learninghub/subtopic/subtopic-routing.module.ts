import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SubtopicComponent } from "./subtopic.component";

const routes: Routes = [
  {
    path: '',
    component: SubtopicComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubtopicRoutingModule {}
