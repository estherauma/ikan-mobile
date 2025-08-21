import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyWorkJourneyComponent } from './my-work-journey.component';


const routes: Routes = [
  {
    path: '',
    component: MyWorkJourneyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyWorkJourneyRoutingModule {}
