import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-recordoptionmodal',
  templateUrl: './recordoptionmodal.component.html',
  styleUrls: ['./recordoptionmodal.component.scss'],
})
export class RecordoptionmodalComponent implements OnInit {
  title;
  constructor(
    public modalCrt: ModalController
  ) { }

  ngOnInit() { }

  onRecord() {
    this.modalCrt.dismiss({location:'recordedUrl'});
  }

  onChoseAudio() {
    this.modalCrt.dismiss({location:'chosenUrl'});
  }

}
