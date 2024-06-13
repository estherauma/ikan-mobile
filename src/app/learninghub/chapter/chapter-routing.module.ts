import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChapterComponent } from './chapter.component';

const routes: Routes = [
  {
    path: '',
    component: ChapterComponent
  },
  {
    path: ':subChapterId',
    loadChildren: () => import('../subchapter/subchapter.module').then( m => m.SubchapterModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChapterRoutingModule { }
