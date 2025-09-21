import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerifyCodeComponent } from './verify-code.component';

const routes: Routes = [
  {
    path: '',
    component: VerifyCodeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifyCodeRoutingModule {}
