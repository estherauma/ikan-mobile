import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.modules';
import { MyWorkJourneyRoutingModule } from './my-work-journey-routing.module';
import { MyWorkJourneyComponent } from './my-work-journey.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MyWorkJourneyRoutingModule,
  ],
  declarations: [MyWorkJourneyComponent]
})
export class MyWorkJourneyModule {}
