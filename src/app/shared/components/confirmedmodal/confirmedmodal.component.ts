import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirmedmodal',
  templateUrl: './confirmedmodal.component.html',
  styleUrls: ['./confirmedmodal.component.scss'],
})
export class ConfirmedmodalComponent implements OnInit {
  title;
  status;
  msg;
  btnTitle;
  link;
  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  onModalClose() {
    this.modalCtrl.dismiss();
  }

}
