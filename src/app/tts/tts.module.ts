import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TtsComponent } from './tts.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.modules';
import { SharedComponentsModule } from '@fiftyeight/shared-components';
import { TtsRoutingModule } from './tts-routing.module';


@NgModule({
  declarations: [ TtsComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SharedComponentsModule,
    TtsRoutingModule,
  ]
})
export class TtsModule { }
