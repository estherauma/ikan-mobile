import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirmmodal',
  templateUrl: './confirmmodal.component.html',
  styleUrls: ['./confirmmodal.component.scss'],
})
export class ConfirmmodalComponent implements OnInit {
  title;
  description;
  link;
  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  radioChangeHandler(data){
    const result =  data.detail.value === 'yes' ? 'yes' : 'no';
    this.modalCtrl.dismiss(result);
  }

}
