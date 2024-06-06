import { Injectable } from '@angular/core';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { UploadType } from '../../types/types';


@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(
    private chooser: Chooser,
  ) { }


  async chooseFile(types: UploadType[] = ['application/pdf']) {
    try {
      const result = await FilePicker.pickFiles({
        types
      });
  
      if (types[0] === 'application/pdf'){
        const file = result.files[0];
        const fileName = file?.name;
    
        return await this.saveFile(file?.path, fileName, 'pdf');
      } else {
        const file = result.files[0];
        const fileName = file?.name;
    
        return await this.saveFile(file?.path, fileName, 'image');
      }
    } catch (error) {
      console.error('Error in upload.service.ts at chooseFile(). Failed to select file.', error);
      return null;
    }
  }

  isPlatformWeb() {
    if (Capacitor.getPlatform() === 'web') {return true;};
    return false;
  }

  async uploadPicture(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        source,
        width: 600,
        resultType: this.isPlatformWeb() ? CameraResultType.DataUrl : CameraResultType.Uri,
        saveToGallery: true,
      });

      const lastSlashIndex = image?.path?.lastIndexOf('/');
      const fileName = image?.path?.substring(lastSlashIndex + 1);

      return await this.saveFile(image?.path, fileName, 'image');
    } catch (error) {
      console.error('Error in upload.service.ts at takePicture(). Failed to capture image.', error);
    }
  }

  async saveFile(filePath: string, fileName: string, type: 'image' | 'pdf') {
    try {
      const original = await Filesystem.readFile({ path: filePath });
      await Filesystem.writeFile({
        path: fileName,
        data: original.data,
        directory: Directory.Data
      }).catch((e) => {
        console.log(e);
      });
  
      const fileUri = await Filesystem.getUri({
        directory: Directory.Data,
        path: fileName
      });
      const webPath = Capacitor.convertFileSrc(fileUri.uri);
  
      if (type === 'image') {
        return {
          fileName,
          webPath,
          docType: type
        }
      } else if (type === 'pdf') {
        return {
          fileName,
          uriPath: fileUri.uri,
          docType: type
        }
      }
    } catch (error) {
      console.error(`Error in upload.service.ts at saveFile(). Failed to save file. ${fileName}`, error);
      return null;
    }
  }

  async choosePdfFile() {
    try {
      const result = await this.chooser.getFile({mimeTypes: 'application/pdf'});
      const fileName = result.name;

      return await this.saveFile(result.path, fileName, 'pdf');
    } catch (error) {
      console.log('upload file error', error);
      console.error('Error in upload.service.ts at choosePdfFile(). Failed to select pdf file.', error);
      return null;
    }
  }

  async retrieveAndReturnBlob(fileUrl) {
    try {
      const fileName = fileUrl.split('files/')[1];
      const file = await Filesystem.getUri({
        path: fileName,
        directory: Directory.Data,
      });
      const fileUri = Capacitor.convertFileSrc(file.uri);
      const fileData = await fetch(fileUri);
      const blob = await fileData.blob();
      const fileBlob = new Blob([blob]);
      const fileUpload = new File([fileBlob], fileName);
      return fileUpload;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
