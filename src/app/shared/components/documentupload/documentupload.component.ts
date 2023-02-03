import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-documentupload',
  templateUrl: './documentupload.component.html',
  styleUrls: ['./documentupload.component.scss'],
})
export class DocumentuploadComponent implements OnInit {
  @Input() imgUrl = '';
  @Input() isTransparent = false;
  @Input() type: 'display' | 'upload' = 'display';
  @Input() variant: 'dotted' | 'solid' = 'dotted';
  @Input() name = '';
  @Input() uploadedDate = '';
  constructor() { }

  ngOnInit() {}

}
