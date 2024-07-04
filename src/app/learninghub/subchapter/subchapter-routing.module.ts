import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubchapterComponent } from './subchapter.component';

const routes: Routes = [
  {
    path: '',
    component: SubchapterComponent
  },
  {
    path: 'question/:key',
    loadChildren: () => import('../question/question.module').then( m => m.QuestionModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubchapterRoutingModule { }
