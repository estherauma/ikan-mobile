import { Injectable } from '@angular/core';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
// import { FilePicker } from '@capawesome/capacitor-file-picker';


type UploadType = 'application/pdf' | 'image/png';
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor() { }


  async choseFile(types: UploadType[] = ['application/pdf']) {
    // const result = await FilePicker.pickFiles({
    //   types
    // });
    // const file = result.files[0];
    // return file;
    return null;
  }

  isPlatformWeb() {
    if (Capacitor.getPlatform() === 'web') {return true;};
    return false;
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      source: CameraSource.Prompt,
      allowEditing: true,
      width: 600,
      resultType: this.isPlatformWeb() ? CameraResultType.DataUrl : CameraResultType.Uri,
    });

    if (this.isPlatformWeb()) {
      return {...image, path:image.dataUrl};
    }

    return {...image, path:image.webPath};
  }

}
