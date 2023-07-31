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
    loadChildren: () => import('../section/section.module').then( m => m.SectionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VariantPageRoutingModule {}
