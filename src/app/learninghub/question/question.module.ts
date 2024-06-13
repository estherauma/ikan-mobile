import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { SharedModule } from "src/app/shared/shared.modules";

import { QuestionComponent } from "./question.component";
import { QuestionRoutingModule } from "./question-routing.module";

@NgModule({
  declarations: [QuestionComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    QuestionRoutingModule,
  ],
})
export class QuestionModule {}
