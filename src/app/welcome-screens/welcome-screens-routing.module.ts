import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeScreensComponent } from './welcome-screens.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeScreensComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeScreensRoutingModule {}
