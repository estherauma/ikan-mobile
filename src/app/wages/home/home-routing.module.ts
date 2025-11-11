import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'vessel-wages',
    loadChildren: () => import('../vessel-wages/vessel-wages.module').then(m => m.VesselWagesModule)
  },
  {
    path: 'wage-details',
    loadChildren: () => import('../wage-detail/wage-detail.module').then(m => m.WageDetailModule)
  },
  {
    path: 'wage-tracking-help',
    loadChildren: () => import('../wage-tracking-help/wage-tracking-help.module').then(m => m.WageTrackingHelpModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
