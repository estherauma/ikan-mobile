import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.modules';
import { RegisterSuccessComponent } from './register-success.component';
import { RegisterSuccessRoutingModule } from './register-success-routing.module';


@NgModule({
  declarations: [ RegisterSuccessComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RegisterSuccessRoutingModule
  ]
})
export class RegisterSuccessModule { }
