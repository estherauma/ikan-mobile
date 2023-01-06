import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignatureviewPage } from './signatureview.page';

const routes: Routes = [
  {
    path: '',
    component: SignatureviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignatureviewPageRoutingModule {}
