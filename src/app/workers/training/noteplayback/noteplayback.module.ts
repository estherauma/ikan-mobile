import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoteplaybackPageRoutingModule } from './noteplayback-routing.module';

import { NoteplaybackPage } from './noteplayback.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoteplaybackPageRoutingModule,
    SharedModule
  ],
  declarations: [NoteplaybackPage]
})
export class NoteplaybackPageModule {}
