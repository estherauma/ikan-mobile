import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClausesPageRoutingModule } from './clauses-routing.module';

import { ClausesPage } from './clauses.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClausesPageRoutingModule,
    SharedModule
  ],
  declarations: [ClausesPage]
})
export class ClausesPageModule {}
