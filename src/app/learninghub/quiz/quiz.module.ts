import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { SharedModule } from "src/app/shared/shared.modules";
import { QuizComponent } from "./quiz.component";
import { QuizRoutingModule } from "./quiz-routing.module";


@NgModule({
  declarations: [QuizComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    QuizRoutingModule,
  ],
})
export class QuizModule {}
