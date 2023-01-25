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
import { FilterComponent } from './components/filter/filter.component';
import { DocumentactionsComponent } from './components/documentactions/documentactions.component';
import { DocumentselectedactionComponent } from './components/documentselectedaction/documentselectedaction.component';
import { ConfirmmodalComponent } from './components/confirmmodal/confirmmodal.component';
import { ConfirmedmodalComponent } from './components/confirmedmodal/confirmedmodal.component';
import { RecordoptionmodalComponent } from './components/recordoptionmodal/recordoptionmodal.component';
import { TitleComponent } from './components/title/title.component';
import { AuthbgpaperComponent } from './components/authbgpaper/authbgpaper.component';
import { ButtonComponent } from './components/button/button.component';
import { WorkordercardComponent } from './components/workordercard/workordercard.component';
import { AgentcardComponent } from './components/agentcard/agentcard.component';
import { QuestiontitlecardComponent } from './components/questiontitlecard/questiontitlecard.component';
import { NotificationcardComponent } from './components/notificationcard/notificationcard.component';
import { AttachmentComponent } from './components/attachment/attachment.component';
import { BadgeComponent } from './components/badge/badge.component';
import { GenericmodalComponent } from './components/genericmodal/genericmodal.component';
import { MaincardComponent } from './components/maincard/maincard.component';
import { ProgressbarComponent } from './components/progressbar/progressbar.component';
import { VesselownercardComponent } from './components/vesselownercard/vesselownercard.component';


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
    ButtonComponent,
    AuthbgpaperComponent,
    WorkordercardComponent,
    AgentcardComponent,
    MaincardComponent,
    ProgressbarComponent,
    QuestiontitlecardComponent,
    NotificationcardComponent,
    AttachmentComponent,
    BadgeComponent,
    VesselownercardComponent,
    GenericmodalComponent,
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
    ButtonComponent,
    AuthbgpaperComponent,
    WorkordercardComponent,
    AgentcardComponent,
    MaincardComponent,
    ProgressbarComponent,
    QuestiontitlecardComponent,
    NotificationcardComponent,
    AttachmentComponent,
    BadgeComponent,
    VesselownercardComponent,
    GenericmodalComponent,
  ]
})

export class SharedModule {}
