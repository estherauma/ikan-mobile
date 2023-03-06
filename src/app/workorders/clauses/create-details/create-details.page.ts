import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-create-details',
  templateUrl: './create-details.page.html',
  styleUrls: ['./create-details.page.scss'],
})
export class CreateDetailsPage extends BaseformPage implements OnInit {
  workOrderId: any;
  constructor(
    public activatedRoute: ActivatedRoute,
    public sharedMethods: SharedmethodsService,
    public router: Router,
    public contentService: ContentService,
  ) {
    super(contentService);
    const pageData = this.contentService.getContentByPropertyName('create-workorder-clause-detail');
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {
    this.submitButtonText = this.contentService.commonText?.create;
    this.activatedRoute.params.subscribe(params => {
      console.log(params);
      this.pageTitle = params?.name;
      this.workOrderId = params?.clauseId;
    });
  }

  async onSubmit(formData) {
    this.sharedMethods.showLoader(this.contentService.commonText?.saving);
    const userData = await this.sharedMethods.getUserData();
    const now = this.sharedMethods.getCurrentDateTime();
    formData.created_by = userData.id;
    formData.updated_by = userData.id;
    formData.created_at = formData.updated_at = now;
  }
}
