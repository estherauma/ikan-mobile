import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-documentselectedaction',
  templateUrl: './documentselectedaction.component.html',
  styleUrls: ['./documentselectedaction.component.scss'],
})
export class DocumentselectedactionComponent implements OnInit {

  constructor(
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  onDelete() {
    this.modalCtrl.dismiss({action: 'delete'});
  }

}
