import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  @Input() docLink = '/assets/icon/pdf.svg';
  constructor(
    public router: Router
  ) { }

  ngOnInit() {}

  goToDoc() {
    this.router.navigate(['mydocuments/details'], { queryParams: { docLink: this.docLink }});
  }

}
