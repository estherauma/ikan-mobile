import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'chapters/:chapterId',
    loadChildren: () => import('../variant/variant.module').then( m => m.VariantPageModule)
  },
  {
    path: 'case-studies/:caseStudyUid',
    loadChildren: () => import('../subchapter/subchapter.module').then( m => m.SubchapterModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
