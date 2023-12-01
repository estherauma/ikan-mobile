import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingVideoRoutingModule } from './training-video-routing.module';
import { TrainingVideoComponent } from './training-video.component';
import { SharedComponentsModule } from '@fiftyeight/shared-components';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.modules';


@NgModule({
  declarations: [ TrainingVideoComponent ],
  imports: [
    CommonModule,
    TrainingVideoRoutingModule,
    SharedComponentsModule,
    FormsModule,
    IonicModule,
    SharedModule,
  ]
})
export class TrainingVideoModule { }
