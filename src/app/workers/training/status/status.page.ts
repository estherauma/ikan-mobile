import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {
  commonText: any;
  audioRecordings = [
    {
      name: 'one',
      file: '',
      uniqueName: '1669892348463'
    },
    {
      name: 'two',
      file: '',
      uniqueName: '1669892348875'
    },
    {
      name: 'three',
      file: '',
      uniqueName: '16698923488942'
    }
  ];
  datasets = [{
    label: '',
    data: [65, 59, 80],
  }];
  trainingStatuses = [
    {percentage: 100, title: 'Title of completion bar 1'},
    {percentage: 50, title: 'Title of completion bar 2'},
    {percentage: 75, title: 'Title of completion bar 3'},
    {percentage: 90, title: 'Title of completion bar 4'},
  ];
  learningHubStatuses = [
    {percentage: 100, title: 'Pre-departure'},
    {percentage: 50, title: 'On board'},
    {percentage: 75, title: 'Post-departure'},
  ];
  constructor(
    public activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    public router: Router,
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.activatedRoute.params.subscribe((params: any) => {
      if (Object.keys(params).length === 0) {
        return;
      }
      this.audioRecordings.unshift({
        ...params,
        file: this.sanitizer.bypassSecurityTrustResourceUrl(params.file)
      });
    });
  }

  onRecord() {
    this.router.navigate(['/workers/recordnote']);
  }

  onDelete(fileToDelete) {
    const newAudioRecordings = this.audioRecordings.filter((el) => el.uniqueName !== fileToDelete);
    this.audioRecordings = newAudioRecordings;
  }
}
