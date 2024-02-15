import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.page.html',
  styleUrls: ['./worker.page.scss'],
})
export class WorkerPage implements OnInit {
  commonText: any;
  pageTitle: string = 'My Profile'
  imageUrl: string = '';

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.pageTitle = this.commonText?.myProfile || this.pageTitle;
  }

  saveProfile() {}

}
