import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { SharedModule } from "src/app/shared/shared.modules";
import { SignPayslipComponent } from "./sign-payslip.component";

@NgModule({
  declarations: [SignPayslipComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule
  ],
})
export class SignPayslipModule {}
