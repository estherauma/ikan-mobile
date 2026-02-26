import { Injectable } from '@angular/core';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { DocumentType, UploadType } from '../../types/types';
import { env } from 'src/environments/environment';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';
import { StorageKeys } from '../../types/api-types';


@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(
    private sharedMethods: SharedmethodsService,
  ) {}


  async chooseFile(types: UploadType[] = ['application/pdf']) {
    try {
      const result = await FilePicker.pickFiles({
        types
      });

      if (types[0] === 'application/pdf') {
        const file = result.files[0];
        const fileName = this.sharedMethods.generatePdfFileName(file?.name);

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
    if (Capacitor.getPlatform() === 'web') {return true;}
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
      // TODO: show err to user if upload is cancelled
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
        };
      } else if (type === 'pdf') {
        return {
          fileName,
          uriPath: fileUri.uri,
          docType: type
        };
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

  async retrieveAndReturnBlob(fileUrl) {
    try {
      if (!fileUrl) {return null;}

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
      console.log(error);
      return null;
    }
  }

  /**
   * Fetches file from the server and saves it to the device's file system.
   *
   * @param fileUrl path to the file on the server
   * @returns returns the file path on the device
   */
  async fetchAndSaveFile(fileUrl) {
    try {
      if (!fileUrl) {return null;}
      
      const pathWithoutParams = fileUrl?.split('?')[0];
      const parts = pathWithoutParams?.split(`${env.gsBucketName}/`);
      const filePath = parts?.length > 1 ? parts[1] : parts[0];
      
      // _ikan_ matches the file name prefix on the api
      const filePathParts = filePath?.split('_ikan_');
      const fileName = filePathParts?.length > 1 ? filePathParts[1] : filePathParts[0];
      const isPdf = fileName?.endsWith('.pdf');

      const readResult = await Filesystem.readdir({
        directory: Directory.Data,
        path: ''
      });

      if (!readResult?.files.some(item => item.name === fileName)) {
        const path = `file-download?url=${encodeURIComponent(filePath)}`;
        const accessToken = await this.sharedMethods.readDataFromStorage(StorageKeys.apiToken);
        const headers = {
          Authorization: `Bearer ${accessToken}`
        };
        const fileData = await fetch(`${env.apiUrl}/${path}`, { headers });

        if (fileData.ok) {
          const blob = await fileData.blob();
          const result = await this.convertBlobToBase64(blob);

          const writtenFile =  await Filesystem.writeFile({
            path: isPdf ? this.sharedMethods?.generatePdfFileName(fileName) : fileName,
            data: result as string,
            directory: Directory.Data,
          });

          return isPdf ? writtenFile?.uri : Capacitor.convertFileSrc(writtenFile?.uri);
        } else {
          console.error('Failed to fetch file', fileData);
          return null;
        }
      } else {
        const path = await Filesystem.getUri({
          directory: Directory.Data,
          path: fileName
        });

        return  isPdf ? path?.uri : Capacitor.convertFileSrc(path?.uri);
      }
    } catch (error) {
      console.error('File download error', error);
      return null;
    }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  convertBlobToArrayBuffer = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsArrayBuffer(blob);
  });

  retrieveAndReturnArrayBuffer(fileUrl) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!fileUrl) {resolve(null);}

        const fileName = fileUrl.split('files/')[1];
        const file = await Filesystem.getUri({
          path: fileName,
          directory: Directory.Data,
        });
        const fileUri = Capacitor.convertFileSrc(file.uri);
        const fileData = await fetch(fileUri);
        const blob = await fileData.blob();
        const arrayBuffer = await this.convertBlobToArrayBuffer(blob);
        resolve(arrayBuffer);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}
