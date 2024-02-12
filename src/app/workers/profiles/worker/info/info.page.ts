import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { UserData } from 'src/app/shared/types/api-types';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage extends BaseformPage implements OnInit {
  submitButtonText = 'Save';
  userData: UserData;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
  ) {
    super(contentService);
  }

  async ngOnInit() {
    this.commonText = this.contentService.commonText;
    this.submitButtonText = this.commonText?.save;
    this.userData = await this.sharedMethods.getUserData();
    this.initializeForm();
    console.log('userData: ', this.userData);
  }

  initializeForm() {
    const pageData = this.contentService.getContentByPropertyName('workerbudiinfo');
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions?.forEach((entry) => {
      const value = this.userData[entry.key] || '';
      this.group[entry.key] = new FormControl(value, [Validators.required]);

      if (entry.key === 'email') {
        const email = this.userData?.email || '';
        this.group[entry.key] = new FormControl(email, [Validators.required, Validators.email]);
      }
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  onSubmit(data) {
    console.log('submitted info data: ', data);
  }


}
