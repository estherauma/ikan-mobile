import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
    selector: 'app-twaiwanese',
    templateUrl: './taiwanese.page.html',
    styleUrls: ['./taiwanese.page.scss'],
    standalone: false
})
export class TaiwanesePage extends BaseformPage implements OnInit {

  pageTitle = 'My Profile';
  profileFormGroup;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
  ) {
    super(contentService);
    const profileFormData = this.contentService.getContentByPropertyName('taiwaneseagentprofileform');
    this.formQuestions = profileFormData.formQuestions;
    this.submitButtonText = 'Submit';
    this.formQuestions.forEach((entry) => {
      const validators = this.sharedMethods.getFormValidators(entry);
      this.group[entry.key] = new FormControl('', validators);
    });
    this.profileFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {
  }

  async onSubmit(formData) {}

}
