import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TtsComponent } from './tts.component';

const routes: Routes = [
  {
    path: '',
    component: TtsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TtsRoutingModule {}