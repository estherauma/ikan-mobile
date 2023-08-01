import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VariantPage } from './variant.page';

const routes: Routes = [
  {
    path: '',
    component: VariantPage
  },
  {
    path: ':subChapterId',
    loadChildren: () => import('../subchapter/subchapter.module').then( m => m.SubchapterModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VariantPageRoutingModule {}
