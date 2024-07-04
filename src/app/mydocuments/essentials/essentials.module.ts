import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { EssentialsRoutingModule } from "./essentials-routing.module";
import { SharedModule } from "src/app/shared/shared.modules";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EssentialsRoutingModule,
    SharedModule
  ],
})
export class EssentialsModule {}
