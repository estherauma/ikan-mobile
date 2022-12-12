import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordnotePage } from './recordnote.page';

const routes: Routes = [
  {
    path: '',
    component: RecordnotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordnotePageRoutingModule {}
