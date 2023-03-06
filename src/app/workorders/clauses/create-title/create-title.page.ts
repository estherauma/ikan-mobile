import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { WorkordersDataService } from '../../data/workorders-data.service';

@Component({
  selector: 'app-create-title',
  templateUrl: './create-title.page.html',
  styleUrls: ['./create-title.page.scss'],
})
export class CreateTitlePage extends BaseformPage implements OnInit {
  workOrderId: number;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public router: Router,
    public modalCtrl: ModalController,
    private workOrdersService: WorkordersDataService
  ) {
    super(contentService);
    const pageData = this.contentService.getContentByPropertyName('create-workorder-clause-title');
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {
    this.submitButtonText = this.contentService.commonText?.create;
  }

  async onSubmit(formData) {
    this.sharedMethods.showLoader(this.contentService.commonText?.saving);
    const userData = await this.sharedMethods.getUserData();
    const now = this.sharedMethods.getCurrentDateTime();
    formData.created_by = userData.id;
    formData.updated_by = userData.id;
    formData.created_at = formData.updated_at = now;
    formData.workOrderId = this.workOrderId;
    const insertId =  await this.workOrdersService.createWorkorderClauseTitle(formData);
    this.sharedMethods.hideLoader();
    this.modalCtrl.dismiss();
    this.router.navigate(['/workorders/clauses/create-details', {clauseId: insertId, name: formData.name}]);
  }

}
