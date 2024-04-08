import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubchapterComponent } from './subchapter.component';

const routes: Routes = [
  {
    path: '',
    component: SubchapterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubchapterRoutingModule { }
