import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-badgeinfo',
  templateUrl: './badgeinfo.page.html',
  styleUrls: ['./badgeinfo.page.scss'],
})
export class BadgeinfoPage implements OnInit {
  completed;
  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  onComplete() {
    this.modalCtrl.dismiss({});
  }

}
