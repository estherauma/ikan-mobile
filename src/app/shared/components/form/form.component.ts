import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { UploadService } from 'src/app/shared/services/upload/upload.service';
import { ImageselectComponent } from '../imageselect/imageselect.component';
import { RecordoptionmodalComponent } from '../recordoptionmodal/recordoptionmodal.component';
import { ContentService } from '../../services/content/content.service';
import { FieldType, Icons, UserData } from '../../types/api-types';
import { SharedmethodsService } from '../../services/sharedmethods/sharedmethods.service';
import { AudioService } from '../../services/audio/audio.service';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';
import { ApiService } from '../../services/api/api.service';
import { of, map, catchError } from 'rxjs';
import { GlobalErrorHandlerService } from '../../services/error-handler/global-error-handler.service';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: false
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
  @Input() uploadPictureIcon = 'assets/icon/camera.svg';
  @Input() uploadPictureText = '';
  @Input() uploadDocIcon = 'assets/icon/pdf.svg';
  @Input() selectFileIcon = 'assets/icon/documents.svg';
  @Input() uploadDocText = '';
  @Input() selectFileText  = 'Select file';
  @Input() showCancelButton = false;
  @Input() showSurveyDisclaimer = false;
  @Input() disclaimerText = '';

  @Output() formValues = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  @Output() formValue = new EventEmitter<any>();
  @Output() dataFromCustomButton = new EventEmitter<any>();

  formKeysToRemove = [];
  typesToExclude = ['h1','h2','h3','h4','h5','h6','p'];
  typeHereText = 'Type here';
  selectDateText = 'Select a date'; // TODO: add to prismic
  commonText: any;
  docsCommonText: any;
  currentLanguage = 'en-us';
  userData: UserData;

  constructor(
    public uploadService: UploadService,
    public modalCtrl: ModalController,
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public audioService: AudioService,
    public alertController: AlertController,
    public apiService: ApiService,
    public globalErrorHandler: GlobalErrorHandlerService,
  ) { }

  async ngOnInit() {
    this.userData = await this.sharedMethods.getUserData();
    this.commonText = this.contentService?.commonText;
    this.currentLanguage = this.contentService?.currentLanguage;
    const docsPageData = this.contentService.getContentByPropertyName('my-documents-common-text');
    this.docsCommonText = this.sharedMethods.convertAdditionalTextToObj(docsPageData?.additionalText);
    this.typeHereText = this.commonText?.typeHere;
    this.uploadPictureText = this.commonText?.uploadPicture;
    this.uploadDocText = this.commonText?.uploadDocument;
    this.selectFileText = this.commonText?.selectFile ?? this.selectFileText;
    this.selectDateText = this.commonText?.selectADate;
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

    this.tunaFormquestions?.forEach((question) => {
      if (question?.displayquestion && (question?.questionType === 'tel' || question?.questionType === 'telephone')) {
        const telControl = this.tunaFormGroup.get(question.key);
        if (telControl) {
          telControl.setAsyncValidators(this.validatePhone(question.key));
          // Temporarily disabled because the api calls are cancelled when the user types fast
          // set updateOn to blur to avoid too many API calls
          // (telControl as any)._updateOn = 'blur';
          
          // re-validate when the value changes
          telControl.valueChanges.subscribe(() => {
            if (telControl.dirty) {
              telControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
            }
          });
        }
      }
    });
  }

  validatePhone(control: string) {
    return (): any => {
      const ctrl = this.tunaFormGroup?.controls[control];
      if (!ctrl?.value) { return of(null); }
      // Return no error if user is offline
      if (!navigator.onLine) {
        return of(null);
      }
      const phone_number = ctrl?.value?.trim();
      const user_id = this.userData?.id ?? undefined;
      return this.apiService.post('accounts/check-unique-phone-number/', { phone_number, user_id }).pipe(
        map((res: any) => (res?.unique ? null : { phoneNumberTaken: true })),
        catchError((e) => {
          console.error('Error validating phone number', e);
          this.globalErrorHandler.handleError(
            e,
            'Error validating phone number. Error in form.component.ts at validatePhone().',
          );
          // Return no validation error if there is a server error
          // So we don't block the user from proceeding if there's a server issue (it's captured above)
          return of(null)
        })
      );
    };
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

  async onPdfUpload(key) {
    const file = await this.uploadService.chooseFile();

    this.tunaFormGroup.patchValue({
      [key]: file
    });
  }

  async onFileUpload(key) {
    const alert = await this.alertController.create({
      cssClass: 'tuna-alert select-file-alert',
      header: this.commonText?.selectFilePrompt,
      buttons: [
        {
          text: this.commonText?.selectPdfFile,
          handler: async() => {
            await this.onPdfUpload(key);
            await alert.dismiss();
          }
        },
        {
          text: this.commonText?.takePicture,
          handler: async() => {
            await this.takePicture(key);
            await alert.dismiss();
          }
        },
        {
          text: this.commonText?.cancel,
          role: 'cancel',
          cssClass: 'secondary'
        },
      ]
    });

    await alert.present();
  }

  async takePicture(key) {
    try {
      const modal = await this.modalCtrl.create({
        component: ImageselectComponent,
        cssClass: 'notification-modal'
      });
      await modal.present();

      const data = await modal.onDidDismiss();
      if (await data?.data?.imageData) {
        const val = await data?.data?.imageData;
        this.updateFieldValue(key, val);
        return data?.data?.imageData;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
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
      }
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

  async viewPdf(doc) {
    doc.fileUrl = doc.uriPath || doc.fileUrl;
    if (this.sharedMethods.currentPlatform === 'web') {
      window.open(doc.fileUrl, '_blank');
    } else {
      await FileOpener.openFile({ path: doc.fileUrl})
        .catch((e) => {
          console.log('Error opening file', e);
          this.sharedMethods.showToast(this.docsCommonText?.errorOpeningFile);
        });
    }
  }
}
