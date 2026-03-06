import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { SharedModule } from "src/app/shared/shared.modules";
import { SubtopicComponent } from "./subtopic.component";
import { SubtopicRoutingModule } from "./subtopic-routing.module";
import { SharedComponentsModule } from '@fiftyeight/shared-components';

@NgModule({
  declarations: [SubtopicComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SubtopicRoutingModule,
    SharedComponentsModule,
  ],
})
export class SubtopicModule {}
