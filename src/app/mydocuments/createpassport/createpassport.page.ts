import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { DocumentsDataService } from '../data/documents-data.service';
import { SyncService } from 'src/app/shared/services/sync/sync.service';

@Component({
    selector: 'app-createpassport',
    templateUrl: './createpassport.page.html',
    styleUrls: ['./createpassport.page.scss'],
    standalone: false
})
export class CreatepassportPage extends BaseformPage implements OnInit {
  submitButtonText = 'Submit for review';
  passportData: any;
  isEditing: boolean = false;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public router: Router,
    public modalCtrl: ModalController,
    public documentsDataService: DocumentsDataService,
    public navParams: NavParams,
    public syncService: SyncService,
  ) {
    super(contentService);
  }

  ngOnInit() {
    this.isEditing = this.navParams.get('isEditing');
    this.passportData = this.navParams.get('passportData');
    if (this.isEditing && this.passportData && this.passportData.imageUrl) {
      this.passportData = {...this.passportData, imageUrl: {webPath: this.passportData.imageUrl}};
    }
    this.commonText = this.contentService?.commonText;
    this.submitButtonText = this.isEditing ? this.commonText?.update : this.commonText?.create;
    const pageData = this.contentService.getContentByPropertyName('createpassport');
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.pageTitle = this.isEditing ? this.pageText?.editPassport : pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      const validators = this.sharedMethods.getFormValidators(entry);
      if (this.isEditing && this.passportData[entry.key]) {
        this.group[entry.key] = new FormControl(this.passportData[entry.key], validators);
      } else {
        this.group[entry.key] = new FormControl('', validators);
      }
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  async onSubmit(formData) {
    const userData = await this.sharedMethods.getUserData();
    const now = new Date().toISOString();

    if (!this.isEditing) {
        const passportData = {
          appRef: this.sharedMethods.generateAppRef(),
          userId: userData.id,
          firstName: formData.firstName,
          surname: formData.surname,
          passportNumber: formData.passportNumber,
          dateOfIssue: formData.dateOfIssue,
          dateOfExpiry: formData.dateOfExpiry,
          imageUrl: formData.imageUrl.webPath,
          createdAt: now,
          updatedAt: now,
          createdBy: userData.id,
          updatedBy: userData.id,
        };

        const passportInsertId = await this.documentsDataService.createPassport(
          passportData
        );
        if (passportInsertId) {
          await this.syncService.syncPassports();
          this.modalCtrl.dismiss({ passportData });
        } else {
          this.sharedMethods.showToast(this.pageText?.errSavingPassport || 'Error saving passport');
        }
    } else {
      const passportData = {
        id: this.passportData?.id,
        firstName: formData.firstName,
        surname: formData.surname,
        passportNumber: formData.passportNumber,
        dateOfIssue: formData.dateOfIssue,
        dateOfExpiry: formData.dateOfExpiry,
        imageUrl: formData.imageUrl.webPath,
        updatedAt: now,
        updatedBy: userData.id,
      };
      const passportUpdate = await this.documentsDataService.updatePassport(passportData);
      if (passportUpdate) {
        await this.syncService.syncPassports();
        this.modalCtrl.dismiss({ passportData });
      } else {
        this.sharedMethods.showToast(this.pageText?.errUpdatingPassport || 'Error updating passport');
      }
    }
  }
}
