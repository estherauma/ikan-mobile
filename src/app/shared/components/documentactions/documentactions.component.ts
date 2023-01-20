import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-documentactions',
  templateUrl: './documentactions.component.html',
  styleUrls: ['./documentactions.component.scss'],
})
export class DocumentactionsComponent implements OnInit {

  settingListThree = [
    {name:'Name'},
    {name:'Kind'},
    {name:'Date'},
    {name:'Size'}
  ];
  constructor(
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  onChangeView(action) {
    this.modalCtrl.dismiss({view: action});
  }

}
