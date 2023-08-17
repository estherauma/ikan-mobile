import { Component, OnInit, Input } from '@angular/core';
import { ContentService } from '../../services/content/content.service';

@Component({
  selector: 'app-workercard',
  templateUrl: './workercard.component.html',
  styleUrls: ['./workercard.component.scss'],
})
export class WorkercardComponent implements OnInit {
  commonText: any;

  @Input() worker;

  constructor (
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
  }

}
