import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.page.html',
  styleUrls: ['./worker.page.scss'],
})
export class WorkerPage implements OnInit {
  commonText: any;

  constructor(
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
  }

}
