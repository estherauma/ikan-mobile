import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.modules';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from '@fiftyeight/shared-components';
import { WelcomeScreensComponent } from './welcome-screens.component';
import { WelcomeScreensRoutingModule } from './welcome-screens-routing.module';


@NgModule({
  declarations: [ WelcomeScreensComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SharedComponentsModule,
    WelcomeScreensRoutingModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class WelcomeScreensModule {}
