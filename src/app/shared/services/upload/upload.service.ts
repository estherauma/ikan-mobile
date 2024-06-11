import { Injectable } from '@angular/core';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { DocumentType, UploadType } from '../../types/types';


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

  async deleteDocuments(docs: DocumentType[]) {
    try {
      const directory = Directory.Data;
      const promises = docs.map(async doc => {
        const fileName = doc.fileUrl.split('files/')[1];
        await Filesystem.deleteFile({ path: fileName, directory });
      });

      await Promise.all(promises);
    } catch (error) {
      console.error(error);
    }
  }
}
