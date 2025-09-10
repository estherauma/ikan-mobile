import { Injectable } from '@angular/core';
import {
  VoiceRecorder,
  RecordingData,
  GenericResponse,
  CurrentRecordingStatus,
} from 'capacitor-voice-recorder';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';
import { ContentService } from '../content/content.service';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalErrorHandlerService } from '../error-handler/global-error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  isRecording = false;
  commonText: any;

  constructor(
    public sharedMethods: SharedmethodsService,
    public contentService: ContentService,
    public sanitizer: DomSanitizer,
    public globalErrorHandler: GlobalErrorHandlerService
  ) {
    this.commonText = this.contentService?.commonText;
    VoiceRecorder.requestAudioRecordingPermission();
  }

  /**
   * Checks if device supports audio recording
   * Checks if audio recording permissions are granted
   * Prompts user to accept permissions if not granted
   *
   * @returns true / false based on device audio recording support and permissions
   */
  async checkDevicePermissions() {
    const canRecord = await this.canDeviceVoiceRecord();
    const permissionStatus = await this.getRecordingPermissionStatus();
    if (canRecord && permissionStatus) {
      return true;
    }

    if (!canRecord) {
      await this.sharedMethods.showToast(
        this.commonText?.audioRecordingNotSupported ||
          'Audio recording is not supported'
      );
      return false;
    }
    if (!permissionStatus) {
      const req = await this.requestAudioRecordingPermission();
      if (!req) {
        await this.sharedMethods.showToast(
          this.commonText?.audioPermissionsDenied ||
            'Audio recording permissions denied'
        );
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * Returns true / false based on the ability of the current device (or web browser) to record audio
   */
  async canDeviceVoiceRecord() {
    try {
      const result: GenericResponse =
        await VoiceRecorder.canDeviceVoiceRecord();
      return result?.value;
    } catch (error) {
      this.globalErrorHandler.handleError(
        error,
        'Error in audio.service.ts at canDeviceVoiceRecord(). Checking device audio recording support failed.'
      );
      return false;
    }
  }

  /**
   * Prompts user to give the required permission.
   * Returns true / false based on the user response.
   */
  async requestAudioRecordingPermission() {
    try {
      const result: GenericResponse =
        await VoiceRecorder.requestAudioRecordingPermission();
      return result?.value;
    } catch (error) {
      this.globalErrorHandler.handleError(
        error,
        'Error in audio.service.ts at requestAudioRecordingPermission(). Requesting permission failed.'
      );
      return false;
    }
  }

  /**
   * Returns true / false based on the status of the recording permission.
   * the promise will reject with "COULD_NOT_QUERY_PERMISSION_STATUS"
   * if the current device cannot query the current status of the recording permission
   */
  async getRecordingPermissionStatus() {
    try {
      const result: GenericResponse =
        await VoiceRecorder.hasAudioRecordingPermission();
      return result?.value;
    } catch (error) {
      this.globalErrorHandler.handleError(
        error,
        'Error in audio.service.ts at getRecordingPermissionStatus(). Getting permission status failed.'
      );
      return false;
    }
  }

  /**
   * In case of success the promise will resolve to { value: true }
   * in case of an error the promise will reject with one of the following messages:
   * "MISSING_PERMISSION", "ALREADY_RECORDING", "MICROPHONE_BEING_USED", "DEVICE_CANNOT_VOICE_RECORD", or "FAILED_TO_RECORD"
   */
  async startRecording() {
    try {
      if (this.isRecording) {
        return;
      }

      const permissions = await this.checkDevicePermissions();
      if (permissions) {
        this.isRecording = true;
        const result: GenericResponse = await VoiceRecorder.startRecording();
      }
    } catch (error) {
      this.isRecording = false;
      this.globalErrorHandler.handleError(
        error,
        'Error in audio.service.ts at startRecording(). Recording not started.'
      );
    }
  }

  /**
   * In case of success the promise will resolve to:
   * {"value": { recordDataBase64: string, msDuration: number, mimeType: string }},
   * the file will be in one of several possible formats (more on that later).
   * in case of an error the promise will reject with one of the following messages:
   * "RECORDING_HAS_NOT_STARTED" or "FAILED_TO_FETCH_RECORDING"
   */
  async stopRecording() {
    try {
      if (!this.isRecording) {
        return;
      }
      this.isRecording = false;

      const result: RecordingData = await VoiceRecorder.stopRecording();
      if (result?.value?.recordDataBase64) {
        const file = `data:audio/aac;base64,${result.value?.recordDataBase64}`;
        const uniqueName = `${Date.now()}`;

        return {
          uniqueName,
          file,
        };
      }

      return null;
    } catch (error) {
      this.globalErrorHandler.handleError(
        error,
        'Error in audio.service.ts at stopRecording(). Recording not stopped.'
      );
      return null;
    }
  }

  async saveFile(obj) {
    try {
      const base64String = obj.file.split('data:audio/aac;base64,')[1];
      const savedFile = await Filesystem.writeFile({
        path: `recordings/${obj.uniqueName}`,
        data: base64String as string,
        directory: Directory.Data,
      });

      return {
        uniqueName: obj.uniqueName,
        filepath: savedFile.uri,
      };
    } catch (error) {
      this.globalErrorHandler.handleError(
        error,
        'Error in audio.service.ts at saveFile(). Failed to save audio recording.'
      );
      return null;
    }
  }

  /**
   * @param path uri path
   */
  async retrieveFile(path) {
    const lastIndexOfSlash = path.lastIndexOf('/');
    const filename = path.substring(lastIndexOfSlash + 1);
    const filepath = `recordings/${filename}`;
    const content = await Filesystem.readFile({
      path: filepath,
      directory: Directory.Data,
    });

    const file = `data:audio/aac;base64,${content.data}`;
    return file;
  }

  /**
   * Pauses an ongoing recording. If the recording has not started yet the promise
   * will reject with `RECORDING_HAS_NOT_STARTED`. in case of success the promise will resolve to `{ value: true }` if the pause
   * was successful or `{ value: false }` if the recording is already paused.
   * if the current mobile os does not support this method the promise will reject with `NOT_SUPPORTED_OS_VERSION`
   */
  async pauseRecording() {
    try {
      const result: GenericResponse = await VoiceRecorder.pauseRecording();
      return result.value;
    } catch (error) {
      this.globalErrorHandler.handleError(
        error,
        'Error in audio.service.ts at pauseRecording(). Recording not paused.'
      );
    }
  }

  /**
   * Resumes a paused recording. If the recording has not started yet the promise
   * will reject with `RECORDING_HAS_NOT_STARTED`. in case of success the promise will resolve to `{ value: true }` if the resume
   * was successful or `{ value: false }` if the recording is already running.
   * if the current mobile os does not support this method the promise will reject with `NOT_SUPPORTED_OS_VERSION`
   */
  async resumeAudioRecording() {
    try {
      const result: GenericResponse = await VoiceRecorder.resumeRecording();
      return result.value;
    } catch (error) {
      this.globalErrorHandler.handleError(
        error,
        'Error in audio.service.ts at resumeAudioRecording(). Recording not resumed.'
      );
    }
  }

  /**
   * Returns the current status of the audio recording. ie "NONE" | "RECORDING" | "PAUSED"
   */
  async getAudioRecordingStatus() {
    try {
      const result: CurrentRecordingStatus =
        await VoiceRecorder.getCurrentStatus();
      return result.status;
    } catch (error) {
      this.globalErrorHandler.handleError(
        error,
        'Error in audio.service.ts at getAudioRecordingStatus(). Failed to get audio recording status.'
      );
    }
  }
}
