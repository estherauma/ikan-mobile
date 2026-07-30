import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { DemandlettersDataService } from 'src/app/demandletter/data/demandletters-data.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
    selector: 'app-create',
    templateUrl: './create.page.html',
    styleUrls: ['./create.page.scss'],
    standalone: false
})
export class CreatePage extends BaseformPage implements OnInit {
  constructor(
    public contentService: ContentService,
    public demandLettersDataService: DemandlettersDataService,
    public sharedMethods: SharedmethodsService,
    public modalCtrl: ModalController,
    public router: Router
  ) {
    super(contentService);
    const pageData = this.contentService.getContentByPropertyName('createdemandletter');
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      const validators = this.sharedMethods.getFormValidators(entry);
      this.group[entry.key] = new FormControl('', validators);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {
    this.submitButtonText = this.contentService.commonText?.create;
  }

  async onSubmit(formData) {
    this.sharedMethods.showLoader(this.contentService.commonText.submittingYourData);
    const now = new Date().toISOString();
    const userData = await this.sharedMethods.getUserData();
    formData.created_by = formData.updated_by = userData.id;
    formData.created_at = formData.updated_at = now;
    const insertId = await this.demandLettersDataService.create(formData);
    if (insertId) {
      this.sharedMethods.hideLoader();
      this.modalCtrl.dismiss();
      this.router.navigate(['demandletters/home', formData]);
    } else {
      this.sharedMethods.showLoader(this.contentService.commonText.error);
    }
  }

}
