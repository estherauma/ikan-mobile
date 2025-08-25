import { Component, OnInit, Input } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { SharedmethodsService } from '../../services/sharedmethods/sharedmethods.service';

@Component({
    selector: 'app-workercard',
    templateUrl: './workercard.component.html',
    styleUrls: ['./workercard.component.scss'],
    standalone: false
})
export class WorkercardComponent implements OnInit {
  commonText: any;

  @Input() worker;

  constructor (
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
  }

}
