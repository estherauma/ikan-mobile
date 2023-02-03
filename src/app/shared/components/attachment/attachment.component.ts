import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss'],
})
export class AttachmentComponent implements OnInit {
  @Input() pdfInfo = '';
  @Input() pdfLink = '/assets/icon/pdf.svg';
  @Input() pdfName = '';
  @Input() variant: 'white' | 'transparent' = 'white';
  constructor() { }

  ngOnInit() {}

}
