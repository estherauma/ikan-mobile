import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { UploadService } from '../../services/upload/upload.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-imageselect',
  templateUrl: './imageselect.component.html',
  styleUrls: ['./imageselect.component.scss'],
})
export class ImageselectComponent implements OnInit {
  addImage = '';
  fromImage = '';
  fromGallery = '';
  constructor(
    public contentService: ContentService,
    public uploadService: UploadService,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    this.addImage = this.contentService.commonText?.addImage;
    this.fromGallery = this.contentService.commonText?.fromGallery;
    this.fromImage = this.contentService.commonText?.fromImage;
  }

  async uploadFromGallery() {
    const imageData = await this.uploadService.choseFile(['image/png']);
    this.modalController?.dismiss({ imageData });
  }

  async uploadFromCamera() {
    const imageData = await this.uploadService.takePicture();
    this.modalController?.dismiss({ imageData });
  }



  
}
