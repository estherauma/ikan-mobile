import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from '../../services/content/content.service';

@Component({
  selector: 'app-workordercard',
  templateUrl: './workordercard.component.html',
  styleUrls: ['./workordercard.component.scss'],
})
export class WorkordercardComponent implements OnInit {
  commonText: any;

  @Input() wo;

  constructor(
    private router: Router,
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
  }

  onClick(wo) {
    this.router.navigate(['/workorders/view', wo]);
  }

}
