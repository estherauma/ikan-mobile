import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss'],
})
export class AttachmentComponent implements OnInit {
  @Input() pdfInfo = 'More info. Functionality here is click panel to view.';
  @Input() pdfLink = '/assets/icon/pdf.svg';
  @Input() pdfName = 'Name.pdf';
  constructor() { }

  ngOnInit() {}

}
