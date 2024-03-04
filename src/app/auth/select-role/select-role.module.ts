import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.modules';
import { SelectRoleRoutingModule } from './select-role-routing.module';
import { SelectRoleComponent } from './select-role.component';



@NgModule({
  declarations: [SelectRoleComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SharedModule,
    SelectRoleRoutingModule,
  ],
})
export class SelectRoleModule { }
