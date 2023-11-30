import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingVideoComponent } from './training-video.component';

const routes: Routes = [
  {
    path: '',
    component: TrainingVideoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingVideoRoutingModule { }
