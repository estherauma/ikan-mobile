import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.modules';
import { ViewPassportComponent } from './view-passport.component';


@NgModule({
  declarations: [ ViewPassportComponent ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SharedModule,
  ]
})
export class ViewPassportModule { }