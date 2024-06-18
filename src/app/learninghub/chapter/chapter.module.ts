import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ChapterRoutingModule } from './chapter-routing.module';
import { ChapterComponent } from './chapter.component';
import { SharedModule } from 'src/app/shared/shared.modules';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChapterRoutingModule,
    SharedModule,
  ],
  declarations: [ChapterComponent]
})
export class ChapterModule { }
