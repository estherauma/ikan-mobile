import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailPage } from './detail.page';

const routes: Routes = [
  {
    path: '',
    component: DetailPage,
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'payment',
        loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule)
      },
      {
        path: 'docs',
        loadChildren: () => import('./docs/docs.module').then( m => m.DocsPageModule)
      },
      {
        path: 'training',
        loadChildren: () => import('./training/training.module').then( m => m.TrainingPageModule)
      },
      {
        path: 'placement',
        loadChildren: () => import('./placement/placement.module').then( m => m.PlacementPageModule)
      },
      {
        path: 'info',
        loadChildren: () => import('./info/info.module').then( m => m.InfoPageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailPageRoutingModule {}
