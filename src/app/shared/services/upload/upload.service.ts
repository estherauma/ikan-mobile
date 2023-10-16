import { Injectable } from '@angular/core';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { UploadType } from '../../types/types';


@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor() { }


  async chooseFile(types: UploadType[] = ['application/pdf']) {
    try {
      const result = await FilePicker.pickFiles({
        types
      });
  
      const file = result.files[0];
      const fileName = file?.name;
  
      return await this.saveFile(file?.path, fileName);
    } catch (error) {
      console.error('Error in upload.service.ts at chooseFile(). Failed to select file.', error);
      return null;
    }
  }

  isPlatformWeb() {
    if (Capacitor.getPlatform() === 'web') {return true;};
    return false;
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        source: CameraSource.Camera,
        width: 600,
        resultType: this.isPlatformWeb() ? CameraResultType.DataUrl : CameraResultType.Uri,
        saveToGallery: true,
      });

      const lastSlashIndex = image?.path?.lastIndexOf('/');
      const fileName = image?.path?.substring(lastSlashIndex + 1);

      return await this.saveFile(image?.path, fileName);
    } catch (error) {
      console.error('Error in upload.service.ts at takePicture(). Failed to capture image.', error);
    }
  }

  async saveFile(filePath: string, fileName: string) {
    try {
      const original = await Filesystem.readFile({ path: filePath });
      await Filesystem.writeFile({
        path: fileName,
        data: original.data,
        directory: Directory.Data
      }).catch((e) => {
        console.log(e);
      });
  
      const photoUri = await Filesystem.getUri({
        directory: Directory.Data,
        path: fileName
      });
      const webPath = Capacitor.convertFileSrc(photoUri.uri);
  
      return {
        fileName,
        webPath,
      }
    } catch (error) {
      console.error(`Error in upload.service.ts at saveFile(). Failed to save file. ${fileName}`, error);
      return null;
    }
  }
}
