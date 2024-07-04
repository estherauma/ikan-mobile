import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.modules';
import { ViewImageComponent } from './view-image.component';


@NgModule({
  declarations: [ ViewImageComponent ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SharedModule,
  ]
})
export class ViewImageModule { }
