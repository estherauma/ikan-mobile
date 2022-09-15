import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormComponent } from './components/form/form.component';
import { HeaderComponent } from './components/header/header.component';



@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    CommonModule
  ],
  declarations: [
    FormComponent,
    HeaderComponent
  ],
  exports: [
    FormComponent,
    HeaderComponent
  ]
})

export class SharedModule {}
