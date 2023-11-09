import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetHelpComponent } from './get-help.component'; 

const routes: Routes = [
  {
    path: '',
    component: GetHelpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GetHelpRoutingModule {}
