import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreateTitlePageRoutingModule } from './create-title-routing.module';
import { CreateTitlePage } from './create-title.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateTitlePageRoutingModule,
    SharedModule
  ],
  declarations: [CreateTitlePage]
})
export class CreateTitlePageModule {}
