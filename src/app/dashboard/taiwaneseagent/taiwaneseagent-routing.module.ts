import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaiwaneseagentPage } from './taiwaneseagent.page';

const routes: Routes = [
  {
    path: '',
    component: TaiwaneseagentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaiwaneseagentPageRoutingModule {}
