import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content/content.service';

@Component({
  selector: 'app-imageselect',
  templateUrl: './imageselect.component.html',
  styleUrls: ['./imageselect.component.scss'],
})
export class ImageselectComponent implements OnInit {
  addImage;
  fromImage;
  fromGallery;
  constructor(
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.addImage = this.contentService.commonText?.addImage;
    this.fromGallery = this.contentService.commonText?.fromGallery;
    this.fromImage = this.contentService.commonText?.fromImage;
  }

}
