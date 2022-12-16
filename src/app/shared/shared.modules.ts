import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormComponent } from './components/form/form.component';
import { HeaderComponent } from './components/header/header.component';
import { InviteCodeInputComponent } from './components/invite-code-input/invite-code-input.component';
import { SearchComponent } from './components/search/search.component';
import { DashboardelcomesectionComponent } from './dashboardelcomesection/dashboardelcomesection.component';
import { ChartComponent } from './components/chart/chart.component';
import { FilterComponent } from './filter/filter.component';
import { DocumentactionsComponent } from './components/documentactions/documentactions.component';
import { DocumentselectedactionComponent } from './components/documentselectedaction/documentselectedaction.component';
import { ConfirmmodalComponent } from './components/confirmmodal/confirmmodal.component';
import { ConfirmedmodalComponent } from './components/confirmedmodal/confirmedmodal.component';
import { RecordoptionmodalComponent } from './components/recordoptionmodal/recordoptionmodal.component';


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
    DashboardelcomesectionComponent,
    ChartComponent,
    FilterComponent,
    DocumentactionsComponent,
    DocumentselectedactionComponent,
    ConfirmmodalComponent,
    ConfirmedmodalComponent,
    RecordoptionmodalComponent
  ],
  exports: [
    FormComponent,
    HeaderComponent,
    InviteCodeInputComponent,
    SearchComponent,
    DashboardelcomesectionComponent,
    ChartComponent,
    FilterComponent,
    DocumentactionsComponent,
    DocumentselectedactionComponent,
    ConfirmmodalComponent,
    ConfirmedmodalComponent,
    RecordoptionmodalComponent
  ]
})

export class SharedModule {}
