 import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from 'src/app/shared/services/audio/audio.service';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-recordnote',
  templateUrl: './recordnote.page.html',
  styleUrls: ['./recordnote.page.scss'],
})
export class RecordnotePage implements OnInit {
  commonText: any;
  recordedNote = null;
  recordingStarted = false;
  recordingStopped = false;
  constructor(
    public audioService: AudioService,
    public router: Router,
    public contentService: ContentService,
  ) { }

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
    this.router.navigate(['/workers/noteplayback', this.recordedNote]);
  }

}
