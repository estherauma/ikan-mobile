import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotecreatePageRoutingModule } from './notecreate-routing.module';

import { NotecreatePage } from './notecreate.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotecreatePageRoutingModule,
    SharedModule
  ],
  declarations: [NotecreatePage]
})
export class NotecreatePageModule {}
