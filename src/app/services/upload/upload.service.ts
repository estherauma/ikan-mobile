import { Injectable } from '@angular/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }


  async choseFile() {
    const result = await FilePicker.pickFiles();
    return result.files[0];

  }

}
