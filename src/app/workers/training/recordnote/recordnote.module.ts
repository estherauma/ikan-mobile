import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordnotePageRoutingModule } from './recordnote-routing.module';

import { RecordnotePage } from './recordnote.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordnotePageRoutingModule,
    SharedModule
  ],
  declarations: [RecordnotePage]
})
export class RecordnotePageModule {}
