import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotecreatePage } from './notecreate.page';

const routes: Routes = [
  {
    path: '',
    component: NotecreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotecreatePageRoutingModule {}
