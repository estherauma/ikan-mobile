import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkerPage } from './worker.page';

const routes: Routes = [
  {
    path: '',
    component: WorkerPage,
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        loadChildren: () => import('./info/info.module').then( m => m.InfoPageModule)
      },
      {
        path: 'payments',
        loadChildren: () => import('./payments/payments.module').then( m => m.PaymentsPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkerPageRoutingModule {}
