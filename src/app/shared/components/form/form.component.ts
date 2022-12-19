import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UploadService } from 'src/app/shared/services/upload/upload.service';
import { RecordoptionmodalComponent } from '../recordoptionmodal/recordoptionmodal.component';

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
  selectedDocuments = {};

  constructor(
    public uploadService: UploadService,
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  onSubmit(event) {
    this.formValue.emit(this.tunaFormGroup.value);
  }

  async onUpload(key){
    const file = await this.uploadService.choseFile();

    this.tunaFormGroup.patchValue({
      [key]: file
    });

    this.selectedDocuments = {...this.selectedDocuments, [key]:file };
  }

  async takePicture(key){
    const picture = await this.uploadService.takePicture();
    this.selectedImages = {...this.selectedImages, [key]:picture };
  }

  removeDocument(key){
    delete this.selectedDocuments[key];
  }

  removePicture(key){
    delete this.selectedImages[key];
  }

  async onRecord(question){
    const recordOptionsModal  = await this.modalCtrl.create({
      component: RecordoptionmodalComponent,
      componentProps:{
        title: question.label
      },
      cssClass: 'tuna-modal'
    });

    recordOptionsModal.present();
    recordOptionsModal.onDidDismiss().then((data: any) => {
      // TODO: handle real audio recording and audio file picking
      if(data && data.data && data.data.location){
        this.tunaFormGroup.patchValue({
          [question.key]: data.data.location
        });
      };
    });
  }
}
