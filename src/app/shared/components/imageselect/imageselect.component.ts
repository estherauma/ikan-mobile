import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { UploadService } from '../../services/upload/upload.service';

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
  ) { }

  ngOnInit() {
    this.addImage = this.contentService.commonText?.addImage;
    this.fromGallery = this.contentService.commonText?.fromGallery;
    this.fromImage = this.contentService.commonText?.fromImage;
  }

  async uploadFromGallery() {
    const img = await this.uploadService.choseFile(['image/png']);
    console.log('uploadFromGallery.........', img)
  }

  async uploadFromCamera() {
    const img = await this.uploadService.takePicture();
    console.log('uploadFromCamera.........', img)
  }



  
}
