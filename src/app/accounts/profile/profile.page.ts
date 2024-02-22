import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { ProfileData } from 'src/app/shared/services/sync/types';
import { UserData, UserRole } from 'src/app/shared/types/api-types';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage extends BaseformPage implements OnInit {
  pageTitle: string = 'My Profile'
  imageUrl: string = '';
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
    this.commonText = this.contentService?.commonText;
    this.pageTitle = this.commonText?.myProfile || this.pageTitle;
    this.submitButtonText = this.commonText?.save;
    this.userData = await this.sharedMethods.getUserData();
    const profData = await this.profilesDataService.getSingleProfile(this.userData?.email);
    if (profData?.id) {
      this.profileData = profData;
    }
    this.initializeForm();
  }

  initializeForm() {
    const pageData = this.contentService.getContentByPropertyName('vo-agent-buyer-profile-form');
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
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

  onSubmit(data) {}
}
