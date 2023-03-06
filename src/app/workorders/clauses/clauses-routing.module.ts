import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClausesPage } from './clauses.page';

const routes: Routes = [
  {
    path: '',
    component: ClausesPage
  },
  {
    path: 'create-title',
    loadChildren: () => import('./create-title/create-title.module').then( m => m.CreateTitlePageModule)
  },
  {
    path: 'create-details',
    loadChildren: () => import('./create-details/create-details.module').then( m => m.CreateDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClausesPageRoutingModule {}
