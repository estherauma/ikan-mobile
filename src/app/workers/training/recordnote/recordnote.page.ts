 import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AudioService } from 'src/app/shared/services/audio/audio.service';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
    selector: 'app-recordnote',
    templateUrl: './recordnote.page.html',
    styleUrls: ['./recordnote.page.scss'],
    standalone: false
})
export class RecordnotePage implements OnInit {
  commonText: any;
  previousUrl: string = '';
  workerId: string;
  recordedNote = null;
  recordingStarted = false;
  recordingStopped = false;
  
  constructor(
    public audioService: AudioService,
    public router: Router,
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      if (params){
        this.previousUrl = params?.previousUrl;
        this.workerId = params?.workerId;
      }
    });
  }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
  }

  startRecording() {
    this.audioService.startRecording();
    this.recordingStarted = true;
  }

  async stopRecording() {
    this.recordingStarted = false;
    const recordedData = await this.audioService.stopRecording();
    this.recordedNote = {...recordedData};
  }

  onSave() {
    const params = {
      ...this.recordedNote,
      previousUrl: this.previousUrl,
      workerId: this.workerId,
    };

    this.router.navigate(['/workers/noteplayback', params], { replaceUrl: true });
  }

}
