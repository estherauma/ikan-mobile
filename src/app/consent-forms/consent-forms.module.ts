import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConsentFormsComponent } from './consent-forms.component';
import { ConsentFormsRoutingModule } from './consent-form-routing.module';



@NgModule({
  declarations: [ ConsentFormsComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsentFormsRoutingModule,
  ]
})
export class ConsentFormsModule { }
