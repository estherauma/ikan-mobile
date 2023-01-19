import { Injectable } from '@angular/core';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  recording = false;
  constructor() {
    VoiceRecorder.requestAudioRecordingPermission();
  }

  startRecording() {
    if (this.recording) {
      return;
    }
    this.recording = true;
    VoiceRecorder.startRecording();
  }
  async stopRecording() {
    if (!this.recording) {
      return;
    }
    this.recording = false;
    return VoiceRecorder.stopRecording().then(async(result: RecordingData) => {
      if (result.value && result.value.recordDataBase64) {
        const file = `data:audio/aac;base64,${result.value.recordDataBase64}`;
        return {
          file,
          uniqueName: Date.now()
        };
      }
      return null;
    });
  }
}
