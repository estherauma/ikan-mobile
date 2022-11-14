import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormComponent } from './components/form/form.component';
import { HeaderComponent } from './components/header/header.component';
import { InviteCodeInputComponent } from './components/invite-code-input/invite-code-input.component';
import { SearchComponent } from './components/search/search.component';
import { ChartComponent } from './components/chart/chart.component';


@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    CommonModule
  ],
  declarations: [
    FormComponent,
    HeaderComponent,
    InviteCodeInputComponent,
    SearchComponent,
    ChartComponent
  ],
  exports: [
    FormComponent,
    HeaderComponent,
    InviteCodeInputComponent,
    SearchComponent,
    ChartComponent
  ]
})

export class SharedModule {}
