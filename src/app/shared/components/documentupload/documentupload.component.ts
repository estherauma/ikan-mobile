import { Component, Input, OnInit } from '@angular/core';
import { ContentService } from '../../services/content/content.service';

@Component({
  selector: 'app-documentupload',
  templateUrl: './documentupload.component.html',
  styleUrls: ['./documentupload.component.scss'],
})
export class DocumentuploadComponent implements OnInit {
  commonText: any;

  @Input() imgUrl = '';
  @Input() iconUrl = '';
  @Input() isTransparent = false;
  @Input() type: 'display' | 'upload' = 'display';
  @Input() variant: 'dotted' | 'solid' = 'dotted';
  @Input() name = '';
  @Input() uploadedDate = '';

  constructor(
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
  }

}
