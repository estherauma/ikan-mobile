import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { UploadService } from 'src/app/shared/services/upload/upload.service';
import { ImageselectComponent } from '../imageselect/imageselect.component';
import { RecordoptionmodalComponent } from '../recordoptionmodal/recordoptionmodal.component';
import { ContentService } from '../../services/content/content.service';
import { FieldType, Icons } from '../../types/api-types';
import { SharedmethodsService } from '../../services/sharedmethods/sharedmethods.service';
import { AudioService } from '../../services/audio/audio.service';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  // TODO: See after prismic integration if we can change this type to something more meaningful
  @Input() tunaFormquestions: any;
  @Input() tunaFormGroup: FormGroup;
  @Input() submitButtonText = 'Submit';
  @Input() btnConfig: any = '';
  @Input() btnFill: 'solid' | 'clear' | 'outline' = 'outline';
  @Input() useCustomSubmitButton = false;
  @Input() isTextBlue = false;
  @Input() isTitleDarkBlue = false;
  @Input() isOtherDarkBlue = false;
  @Input() passwordFieldType: string = FieldType.password;
  @Input() passwordEyeIcon: string = Icons.iconEyeClosed;
  @Input() fieldErrors: any = {};
  @Input() nonFieldErrors: any = [];
  @Input() isSubmitting = false;
  @Input() autocomplete = true;
  @Input() uploadPictureIcon: string = 'assets/icon/camera.svg';
  @Input() uploadPictureText: string = '';
  @Input() uploadDocIcon: string = 'assets/icon/pdf.svg';
  @Input() uploadDocText: string = '';
  @Input() showCancelButton: boolean = false;

  @Output() formValues = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  @Output() formValue = new EventEmitter<any>();
  @Output() dataFromCustomButton = new EventEmitter<any>();

  selectedImages = {};
  // selectedDocuments = {};

  formKeysToRemove = [];
  typesToExclude = ['h1','h2','h3','h4','h5','h6','p'];
  typeHereText = 'Type here';
  selectDateText = 'Select a date'; // TODO: add to prismic
  commonText: any;
  docsCommonText: any;

  constructor(
    public uploadService: UploadService,
    public modalCtrl: ModalController,
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public audioService: AudioService,
    public alertController: AlertController,
    public fileOpener: FileOpener,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    const docsPageData = this.contentService.getContentByPropertyName('my-documents-common-text');
    this.docsCommonText = this.sharedMethods.convertAdditionalTextToObj(docsPageData?.additionalText);
    this.typeHereText = this.commonText?.typeHere;
    this.uploadPictureText = this.commonText?.uploadPicture;
    this.uploadDocText = this.commonText?.uploadDocument;
    this.submitButtonText = this.submitButtonText || this.commonText?.submit;
    this.tunaFormquestions?.map(question => {
      if ([...this.typesToExclude].includes(question.questionType)) {
        this.tunaFormGroup.patchValue({
          [question.key]: question.key
        });
        this.formKeysToRemove.push(question.key);
      }
    });

    this.tunaFormGroup?.valueChanges.subscribe((value) => {
      const finalValues = this.removeUnwantedObjectKey(this.tunaFormGroup.value);

      if (this.useCustomSubmitButton) {
        this.dataFromCustomButton.emit({data: null, valid:  this.tunaFormGroup.valid});
      }

      if (this.useCustomSubmitButton && this.tunaFormGroup.valid) {
        this.dataFromCustomButton.emit({data: finalValues, valid: this.tunaFormGroup.valid});
      }

    });
  }

  onSubmit(event) {
    const finalValues = this.removeUnwantedObjectKey(this.tunaFormGroup.value);
    this.formValue.emit(finalValues);
  }

  onCancel() {
    this.cancel.emit();
  }

  removeUnwantedObjectKey(obj) {
    this.formKeysToRemove.forEach(key => {
      delete obj[key];
    });

    return obj;
  }

  async onUpload(key) {
    const file = await this.uploadService.chooseFile();

    this.tunaFormGroup.patchValue({
      [key]: file
    });
  }

  async takePicture(key) {
    try {
      const modal = await this.modalCtrl.create({
        component: ImageselectComponent,
        cssClass: 'notification-modal'
      });
      modal.present();

      modal.onDidDismiss().then((data) => {
        if (data?.data?.imageData) {
          const val = data?.data?.imageData;
          this.updateFieldValue(key, val);
          return data?.data?.imageData;
        }
      });

      // TODO: Add logic for take photo and update form values list
      // const picture = await this.uploadService.takePicture();
      // this.selectedImages = {...this.selectedImages, [key]:picture };
      
    } catch (error) {
      console.error(error);
    }
  }

  updateFieldValue(key, newValue) {
    this.tunaFormGroup.patchValue({
      [key]: newValue
    });

    this.tunaFormquestions = this.tunaFormquestions?.map((el: any) => {
      if (el.key === key) {
        return {
          ...el,
          value: newValue
        };
      }
      return el;
    });
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
    this.passwordFieldType = (this.passwordFieldType === FieldType.password) ? FieldType.text : FieldType.password;
    this.passwordEyeIcon = (this.passwordEyeIcon === Icons.iconEyeClosed) ? Icons.iconEyeOpen : Icons.iconEyeClosed;
  }

  async handleDeleteImage(e, key) {
    const alert = await this.alertController.create({
      cssClass: 'tuna-alert del-img-prompt-alert',
      header: this.commonText?.deleteImagePrompt,
      buttons: [
        {
          text: this.commonText?.cancel?.toUpperCase(),
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: this.commonText?.delete?.toUpperCase(),
          handler: () => {
            this.updateFieldValue(key, '');
          }
        }
      ]
    });
    await alert.present();
  }

  viewPdf(doc) {
    doc.fileUrl = doc.uriPath || doc.fileUrl;
    if (this.sharedMethods.currentPlatform === 'web') {
      window.open(doc.fileUrl, '_blank');
    } else {
      this.fileOpener.open(doc.fileUrl, 'application/pdf')
      .then(() => console.log('File is opened'))
      .catch(e => {
        console.log('Error opening file', e);
        this.sharedMethods.showToast(this.docsCommonText?.errorOpeningFile);
      });
    }
  }
}
