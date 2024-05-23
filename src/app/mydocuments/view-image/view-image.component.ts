import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { Document } from 'src/app/shared/types/types';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss'],
})
export class ViewImageComponent  implements OnInit {
  imageFile: Document; 

  constructor(
    public sharedMethods: SharedmethodsService,
    public modalCtroller: ModalController,
  ) { }

  ngOnInit() {}

  closeImage() {
    this.modalCtroller.dismiss();
  }
}
