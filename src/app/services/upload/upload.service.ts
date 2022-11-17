import { Injectable } from '@angular/core';
import { FilePicker, File } from '@capawesome/capacitor-file-picker';


type UploadType = 'application/pdf' | 'image/png';
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor() { }


  async choseFile(types: UploadType[] = ['application/pdf']) {
    const result = await FilePicker.pickFiles({
      types
    });
    const file = result.files[0];
    console.log(file.blob);
    // if(file.blob){
    //   const rFile = new File(file.blob, file.name, {
    //     type: file.mimeType
    //   });
    // }
    return file;

  }

}
