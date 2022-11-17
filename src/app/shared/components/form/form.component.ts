import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UploadService } from 'src/app/services/upload/upload.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  // TODO: See after prismic integration if we can change this type to something more meaningful
  @Input() tunaFormquestions: any;
  @Input() tunaFormGroup: FormGroup;
  @Input() submitButtonText: string;

  @Output() formValues = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  @Output() formValue = new EventEmitter<any>();

  selectedImages = {};

  constructor(
    public chooser: UploadService,
  ) { }

  ngOnInit() {}

  onSubmit(event) {
    this.formValue.emit(this.tunaFormGroup.value);
  }

  async onUpload(key){
    const file = await this.chooser.choseFile();

    this.tunaFormGroup.patchValue({
      [key]: file
    });

    this.selectedImages = {...this.selectedImages, [key]:file };

  }

  async takePicture() {
    const image = await Camera.getPhoto({
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
    });
  }

  removeDocument(key){
    delete this.selectedImages[key];
  }
}
