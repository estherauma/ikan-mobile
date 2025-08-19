import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormComponent } from './components/form/form.component';
import { HeaderComponent } from './components/header/header.component';
import { SearchComponent } from './components/search/search.component';
import { DashboardelcomesectionComponent } from './dashboardelcomesection/dashboardelcomesection.component';
import { ChartComponent } from './components/chart/chart.component';
import { FilterComponent } from './components/filter/filter.component';
import { ConfirmmodalComponent } from './components/confirmmodal/confirmmodal.component';
import { ConfirmedmodalComponent } from './components/confirmedmodal/confirmedmodal.component';
import { RecordoptionmodalComponent } from './components/recordoptionmodal/recordoptionmodal.component';
import { TitleComponent } from './components/title/title.component';
import { AuthbgpaperComponent } from './components/authbgpaper/authbgpaper.component';
import { ButtonComponent } from './components/button/button.component';
import { WorkordercardComponent } from './components/workordercard/workordercard.component';
import { AgentcardComponent } from './components/agentcard/agentcard.component';
import { NotificationcardComponent } from './components/notificationcard/notificationcard.component';
import { AttachmentComponent } from './components/attachment/attachment.component';
import { BadgeComponent } from './components/badge/badge.component';
import { GenericmodalComponent } from './components/genericmodal/genericmodal.component';
import { ProgressbarComponent } from './components/progressbar/progressbar.component';
import { ImageselectComponent } from './components/imageselect/imageselect.component';
import { UsercontractcardComponent } from './components/usercontractcard/usercontractcard.component';
import { DocumentuploadComponent } from './components/documentupload/documentupload.component';
import { VesselownercardComponent } from './components/vesselownercard/vesselownercard.component';
import { PlacementoffercardComponent } from './components/placementoffercard/placementoffercard.component';
import { PagetabnavigatorComponent } from './components/pagetabnavigator/pagetabnavigator.component';
import { PageprofilecontainerComponent } from './components/pageprofilecontainer/pageprofilecontainer.component';
import { TitleblockComponent } from './components/titleblock/titleblock.component';
import { WorkercardComponent } from './components/workercard/workercard.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { ContentwrapperComponent } from './components/contentwrapper/contentwrapper.component';
import { FeedbackStatCardComponent } from './components/feedback-stat-card/feedback-stat-card.component';
import { CompaniescardComponent } from './components/companiescard/companiescard.component';
import { CompanycontractcardComponent } from './components/companycontractcard/companycontractcard.component';
import { SelectLanguageComponent } from './components/select-language/select-language/select-language.component';
import { SafeurlPipe } from './pipes/safeurl/safeurl.pipe';
import { PaymentsPage } from '../workers/profiles/worker/payments/payments.page';
import { InfoPage as WorkerProfile } from '../workers/profiles/worker/info/info.page';
import { FilesPage } from '../mydocuments/files/files.page';
import { EssentialsComponent } from '../mydocuments/essentials/essentials.component';
import { ViewImageComponent } from '../mydocuments/view-image/view-image.component';
import { ViewPassportComponent } from '../mydocuments/view-passport/view-passport.component';
import { PaymentCardComponent } from './components/payment-card/payment-card.component';
import { TutorialDetailComponent } from '../tutorials/tutorial-detail/tutorial-detail.component';
import { RichTextComponent } from './components/rich-text/rich-text.component';
import { AudioButtonComponent } from './components/audio-button/audio-button.component';
import { VideoButtonComponent } from './components/video-button/video-button.component';
import { ProgressCircleComponent } from './components/progress-circle/progress-circle.component';


@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    CommonModule
  ],
  declarations: [
    SafeurlPipe,
    FormComponent,
    HeaderComponent,
    SearchComponent,
    DashboardelcomesectionComponent,
    ChartComponent,
    FilterComponent,
    ConfirmmodalComponent,
    ConfirmedmodalComponent,
    RecordoptionmodalComponent,
    TitleComponent,
    ButtonComponent,
    AuthbgpaperComponent,
    WorkordercardComponent,
    AgentcardComponent,
    ProgressbarComponent,
    NotificationcardComponent,
    AttachmentComponent,
    BadgeComponent,
    VesselownercardComponent,
    GenericmodalComponent,
    PaymentCardComponent,
    ImageselectComponent,
    UsercontractcardComponent,
    DocumentuploadComponent,
    PlacementoffercardComponent,
    PagetabnavigatorComponent,
    PageprofilecontainerComponent,
    TitleblockComponent,
    WorkercardComponent,
    AudioPlayerComponent,
    ContentwrapperComponent,
    FeedbackStatCardComponent,
    CompaniescardComponent,
    CompanycontractcardComponent,
    SelectLanguageComponent,
    PaymentsPage,
    WorkerProfile,
    FilesPage,
    EssentialsComponent,
    ViewImageComponent,
    ViewPassportComponent,
    TutorialDetailComponent,
    RichTextComponent,
    AudioButtonComponent,
    VideoButtonComponent,
    ProgressCircleComponent,
  ],
  exports: [
    SafeurlPipe,
    FormComponent,
    HeaderComponent,
    SearchComponent,
    DashboardelcomesectionComponent,
    ChartComponent,
    FilterComponent,
    ConfirmmodalComponent,
    ConfirmedmodalComponent,
    RecordoptionmodalComponent,
    TitleComponent,
    ButtonComponent,
    AuthbgpaperComponent,
    WorkordercardComponent,
    AgentcardComponent,
    ProgressbarComponent,
    NotificationcardComponent,
    AttachmentComponent,
    BadgeComponent,
    VesselownercardComponent,
    GenericmodalComponent,
    PaymentCardComponent,
    ImageselectComponent,
    UsercontractcardComponent,
    DocumentuploadComponent,
    PlacementoffercardComponent,
    PagetabnavigatorComponent,
    PageprofilecontainerComponent,
    TitleblockComponent,
    WorkercardComponent,
    AudioPlayerComponent,
    ContentwrapperComponent,
    FeedbackStatCardComponent,
    CompaniescardComponent,
    CompanycontractcardComponent,
    PaymentsPage,
    WorkerProfile,
    FilesPage,
    EssentialsComponent,
    ViewImageComponent,
    ViewPassportComponent,
    TutorialDetailComponent,
    RichTextComponent,
    AudioButtonComponent,
    VideoButtonComponent,
    ProgressCircleComponent,
  ]
})

export class SharedModule {}
