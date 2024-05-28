import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { DocumentsDataService } from '../data/documents-data.service';

@Component({
  selector: 'app-createpassport',
  templateUrl: './createpassport.page.html',
  styleUrls: ['./createpassport.page.scss'],
})
export class CreatepassportPage extends BaseformPage implements OnInit {
  submitButtonText = 'Submit for review';

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public router: Router,
    public modalCtrl: ModalController,
    public documentsDataService: DocumentsDataService
  ) {
    super(contentService);
    const pageData = this.contentService.getContentByPropertyName('createpassport');
    this.pageTitle = pageData?.pageTitle;
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      const validators = this.sharedMethods.getFormValidators(entry);
      this.group[entry.key] = new FormControl('', validators);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  async onSubmit(formData) {
    const userData = await this.sharedMethods.getUserData();
    const now = this.sharedMethods.getCurrentDateTime();
    const docSaveObj = {
      appRef: this.sharedMethods.generateAppRef(),
      userId: userData.id,
      fileName: 'ikan-my-passport' || formData?.imageUrl.fileName,
      fileUrl: formData?.imageUrl.webPath,
      fileSize: formData?.imageUrl.fileSize || '',
      docType: formData?.imageUrl.docType,
      isEssential: true,
      createdAt: now,
      updatedAt: now,
      createdBy: userData.id,
      updatedBy: userData.id,
    };
    const docInsertId = await this.documentsDataService.create(docSaveObj);
    if (docInsertId) {
      const passportData = {
        appRef: this.sharedMethods.generateAppRef(),
        userId: userData.id,
        documentId: docInsertId,
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
        this.modalCtrl.dismiss({ passportData });
      } else {
        this.sharedMethods.showToast(this.pageText?.errSavingPassport || 'Error saving passport');
      }
    } else {
      // TODO: save image details to local storage to be saved to db later
    }
  }
}
