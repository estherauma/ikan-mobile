import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.modules';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from '@fiftyeight/shared-components';
import { TutorialsComponent } from './tutorials.component';
import { TutorialsRoutingModule } from './tutorials-routing.module';


@NgModule({
  declarations: [ TutorialsComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SharedComponentsModule,
    TutorialsRoutingModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TutorialsModule {}
