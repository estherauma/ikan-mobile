import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomePage
  },
  {
    path: 'vessel-payments',
    loadChildren: () => import('../view/vessel-payments/vessel-payments.module').then( m => m.VesselPaymentsModule)
  },
  {
    path: 'payment-details',
    loadChildren: () => import('../view/payment-details/payment-details.module').then( m => m.PaymentDetailsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
