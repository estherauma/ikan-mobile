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
    loadChildren: () => import('../chapter/chapter.module').then( m => m.ChapterModule)
  },
  {
    path: 'case-studies/:caseStudyUid',
    loadChildren: () => import('../subchapter/subchapter.module').then( m => m.SubchapterModule)
  },
  {
    path: 'tfa-training-video',
    loadChildren: () => import('../training-video/training-video.module').then( m => m.TrainingVideoModule)
  },
  {
    path: 'quiz',
    loadChildren: () => import('../quiz/quiz.module').then( m => m.QuizModule)
  },
  {
    path: 'subtopics/:subtopicId',
    loadChildren: () => import('../subtopic/subtopic.module').then( m => m.SubtopicModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
