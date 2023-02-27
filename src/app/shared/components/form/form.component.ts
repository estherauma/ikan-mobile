import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UploadService } from 'src/app/shared/services/upload/upload.service';
import { CreatePage } from 'src/app/workorders/create/create.page';
import { ImageselectComponent } from '../imageselect/imageselect.component';
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
  @Input() btnConfig: any = '';
  @Input() btnFill: 'solid' | 'clear' | 'outline' = 'outline';
  @Input() useCustomSubmitButton = false;
  @Input() isTextBlue = false;
  @Input() isTitleDarkBlue = false;
  @Input() isOtherDarkBlue = false;
  @Input() passwordFieldType: string;
  @Input() passwordEyeIcon: string;

  @Output() formValues = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  @Output() formValue = new EventEmitter<any>();
  @Output() changeFieldState = new EventEmitter<any>();

  selectedImages = {};
  selectedDocuments = {};

  formKeysToRemove = [];
  typesToExclude = ['h1','h2','h3','h4','h5','h6','p'];

  constructor(
    public uploadService: UploadService,
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.tunaFormquestions.map(question => {
      if ([...this.typesToExclude].includes(question.questionType)) {
        this.tunaFormGroup.patchValue({
          [question.key]: question.key
        });
        this.formKeysToRemove.push(question.key);
      }
    });
  }

  onSubmit(event) {
    const finalValues = this.removeUnwantedObjectKey(this.tunaFormGroup.value);
    this.formValue.emit(finalValues);
  }

  removeUnwantedObjectKey(obj) {
    this.formKeysToRemove.forEach(key => {
      delete obj[key];
    });

    return obj;
  }

  async onUpload(key) {
    const file = await this.uploadService.choseFile();

    this.tunaFormGroup.patchValue({
      [key]: file
    });

    this.selectedDocuments = {...this.selectedDocuments, [key]:file };
  }

  async takePicture(key) {
      const modal = await this.modalCtrl.create({
        component: ImageselectComponent,
        cssClass: 'notification-modal'
      });
      modal.present();

      modal.onDidDismiss().then((data) => {
        // TODO: Form data is here for processing and saving.
      });

      // TODO: Add logic for take photo and update form values list
      // const picture = await this.uploadService.takePicture();
      // this.selectedImages = {...this.selectedImages, [key]:picture };

  }

  removeDocument(key) {
    delete this.selectedDocuments[key];
  }

  removePicture(key) {
    delete this.selectedImages[key];
  }

  async onRecord(question) {
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
      if (data && data.data && data.data.location) {
        this.tunaFormGroup.patchValue({
          [question.key]: data.data.location
        });
      };
    });
  }
  changePasswordState() {
    this.changeFieldState.emit();
  }
}
