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
import { TitleComponent } from './components/title/title.component';
import { ButtonoutlineComponent } from './components/buttonoutline/buttonoutline.component';
import { ButtonsolidComponent } from './components/buttonsolid/buttonsolid.component';
import { AuthbgpaperComponent } from './components/authbgpaper/authbgpaper.component';


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
    RecordoptionmodalComponent,
    TitleComponent,
    ButtonoutlineComponent,
    ButtonsolidComponent,
    AuthbgpaperComponent
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
    RecordoptionmodalComponent,
    TitleComponent,
    ButtonoutlineComponent,
    ButtonsolidComponent,
    AuthbgpaperComponent
  ]
})

export class SharedModule {}
