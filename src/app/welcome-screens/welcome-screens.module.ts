import { NgModule } from '@angular/core';
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
  ]
})
export class WelcomeScreensModule {}
