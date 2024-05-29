import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-view-passport',
  templateUrl: './view-passport.component.html',
  styleUrls: ['./view-passport.component.scss'],
})
export class ViewPassportComponent  implements OnInit {
  userPassportDetails
  passportViewData
  
  constructor(
    public sharedMethods: SharedmethodsService,
    public modalController: ModalController,
  ) { }

  ngOnInit() {}

  closeView() {
    this.modalController.dismiss();
  }

  handleDeleteImage(e) {}
}
