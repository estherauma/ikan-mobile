import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-twaiwanese',
  templateUrl: './taiwanese.page.html',
  styleUrls: ['./taiwanese.page.scss'],
})
export class TaiwanesePage extends BaseformPage implements OnInit {

  pageTitle = 'My Profile';
  profileFormGroup;

  constructor(
    public contentService: ContentService,
  ) {
    super(contentService);
    const profileFormData = this.contentService.getContentByPropertyName('taiwaneseagentprofileform');
    this.formQuestions = profileFormData.formQuestions;
    this.submitButtonText = 'Submit';
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.profileFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {
  }

  async onSubmit(formData) {
    console.log('submit data ---->', formData);
  }

}
