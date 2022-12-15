import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilesPageRoutingModule } from './files-routing.module';

import { FilesPage } from './files.page';
import { SharedModule } from 'src/app/shared/shared.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilesPageRoutingModule,
    SharedModule
  ],
  declarations: [FilesPage]
})
export class FilesPageModule {}
