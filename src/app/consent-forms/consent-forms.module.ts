import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConsentFormsComponent } from './consent-forms.component';
import { ConsentFormsRoutingModule } from './consent-form-routing.module';
import { SharedModule } from '../shared/shared.modules';
import { SharedComponentsModule } from '@fiftyeight/shared-components';



@NgModule({
  declarations: [ ConsentFormsComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsentFormsRoutingModule,
    SharedModule,
    SharedComponentsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ConsentFormsModule { }
