import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { WageDetailComponent } from "./wage-detail.component";
import { WageDetailRoutingModule } from "./wage-detail-routing.module";
import { SharedModule } from "src/app/shared/shared.modules";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WageDetailRoutingModule,
    SharedModule,
  ],
  declarations: [WageDetailComponent],
})
export class WageDetailModule {}
