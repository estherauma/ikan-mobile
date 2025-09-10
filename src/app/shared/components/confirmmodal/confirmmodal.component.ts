import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-confirmmodal',
    templateUrl: './confirmmodal.component.html',
    styleUrls: ['./confirmmodal.component.scss'],
    standalone: false
})
export class ConfirmmodalComponent implements OnInit {
  title;
  description;
  link;

  actionByButton = false;
  actionByRadio = false;
  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    if (this.actionByRadio) {
      this.actionByRadio = true;
    } else {
      this.actionByButton = true;
    }
  }

  radioChangeHandler(data) {
    const result =  data.detail.value === 'yes' ? 'yes' : 'no';
    this.modalCtrl.dismiss(result);
  }

  btnClickHandler(data) {
    const result =  data === 'yes' ? 'yes' : 'no';
    this.modalCtrl.dismiss(result);
  }

}
