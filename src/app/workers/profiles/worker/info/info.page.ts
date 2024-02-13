import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { ProfileData } from 'src/app/shared/services/sync/types';
import { UserData } from 'src/app/shared/types/api-types';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage extends BaseformPage implements OnInit {
  submitButtonText = 'Save';
  userData: UserData;
  profileData: ProfileData;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public profilesDataService: ProfilesDataService,
  ) {
    super(contentService);
  }

  async ngOnInit() {
    this.commonText = this.contentService.commonText;
    this.submitButtonText = this.commonText?.save;
    this.userData = await this.sharedMethods.getUserData();
    const profData = await this.profilesDataService.getSingleProfile(this.userData?.email);
    if (profData?.id) {
      this.profileData = profData;
    }
    this.initializeForm();
  }

  initializeForm() {
    const pageData = this.contentService.getContentByPropertyName('workerbudiinfo');
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions?.forEach((entry) => {
      // this field will not be displayed
      if (entry.key === 'address') {
        return;
      }

      const value = this.profileData?.[entry.key] || this.userData?.[entry.key] || '';
      this.group[entry.key] = new FormControl(value, [Validators.required]);

      if (entry.key === 'email') {
        entry.questionType = 'email';
        this.group[entry.key] = new FormControl(value, [Validators.required, Validators.email]);
      }
      if (entry.key === 'lastName' || entry.key === 'addressLine2' || entry.key === 'addressLine3' || entry.key === 'postalCode') {
        this.group[entry.key] = new FormControl(value, []);
      }
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  async onSubmit(data) {
    this.sharedMethods.showLoader('Saving Profile.....'); // Add to prismic
    const userData = await this.sharedMethods.getUserData();
    const now = this.sharedMethods.getCurrentDateTime();
    data.userRole = userData.role;
    data.updated_by = userData.id;
    data.updated_at = now;
    const profileExists = await this.profilesDataService.checkIfProfileExists(data.email);
    if (profileExists) {
      data = { ...this.profileData, ...data}
      const result = await this.profilesDataService.update(data);
      if (result?.rowsAffected > 0) {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast('Profile Updated Successfully'); // Add to prismic
      } else {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast('Profile Update Failed'); // Add to prismic
      }
    } else {
      data.created_at = now;
      data.created_by = userData.id;
      const insertId = await this.profilesDataService.create(data);
      if (insertId) {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast('Profile Created Successfully'); // Add to prismic
      } else {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast('Profile Creation Failed'); // Add to prismic
      }
    }
  }


}
