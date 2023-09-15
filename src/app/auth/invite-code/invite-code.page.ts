import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { FieldType, Icons } from 'src/app/shared/types/api-types';

@Component({
  selector: 'app-invite-code',
  templateUrl: './invite-code.page.html',
  styleUrls: ['./invite-code.page.scss'],
})
export class InviteCodePage extends BaseformPage implements OnInit {

  pageTitle = 'Invite Code';
  passwordFieldType = FieldType.password;
  passwordEyeIcon = Icons.iconEyeClosed;
  fieldErrors = {};

  constructor(
    public router: Router,
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public apiService: ApiService,
    public cdr: ChangeDetectorRef,
    ) {
      super(contentService);
    
      // const pageData = this.contentService.getContentByPropertyName('accesstoken');
      const pageData = {
        "page_name": "accesstoken",
        "pageTitle": "Create a login",
        "last_updated": "2023-09-12T09:36:21+0000",
        "formQuestions": [
          {
            "key": "accessCode",
            "label": "Access token",
            "options": [],
            "helpText": null,
            "placeholder": null,
            "questionType": "textBox",
            "displayquestion": true
          },
          {
            "key": "password",
            "label": "Password",
            "options": [],
            "help_text": null,
            "placeholder": null,
            "questionType": "password",
            "displayquestion": true
          },
          {
            "key": "passwordConfirm",
            "label": "Confirm your password",
            "options": [],
            "helpText": null,
            "placeholder": null,
            "questionType": "password",
            "displayquestion": true
          }
        ],
        "additionalText": [
          {
            "type": "paragraph",
            "label": "coffeee",
            "value": "Coffee is <strong>good</strong> for you"
          },
          {
            "type": "paragraph",
            "label": "submitButtonText",
            "value": "Go"
          },
          {
            "type": "heading1",
            "label": "sampleHeading",
            "value": "We shall see"
          },
          {
            "type": "unorderedList",
            "label": "Ordered List",
            "value": [
              "asdfasds",
              "sdfsd",
              "asdfasdfasdf"
            ]
          },
          {
            "type": "paragraph",
            "label": "submitButtonText",
            "value": "Go"
          }
        ]
      };
      
      this.pageTitle = pageData?.pageTitle;
      this.pageCommonText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
      this.submitButtonText = this.pageCommonText?.submitButtonText;
      this.formQuestions = pageData?.formQuestions;
      this.formQuestions.forEach((entry) => {
        this.group[entry.key] = new FormControl('', [Validators.required]);
      });
      this.pageFormGroup = new FormGroup(this.group);
      
     }

  onLogin() {
    this.router.navigate(['/intro']);
  }

  async onSubmit(data) {
    this.sharedMethods.showLoader(this.pageCommonText?.loadingText);
    if (data?.password?.trim() !== data?.passwordConfirm?.trim()) {
      
      this.sharedMethods.showToast(this.commonText?.passwordsDoNotMatch);
      return;
    }
    this.apiService.post('accounts/verify-access-token', data)
    .subscribe(
      res => {
        console.log(res);
      },
      error => {
        this.sharedMethods?.hideLoader();
        if (error.status === 400) {
          this.sharedMethods.showToast(error?.error?.message)
        } else {
          this.sharedMethods.showToast(this.commonText?.somethingWentWrong);
        }
      });
  }

  changePasswordFieldState() {
    this.passwordFieldType = (this.passwordFieldType === FieldType.password) ? FieldType.text : FieldType.password;
    this.passwordEyeIcon = (this.passwordEyeIcon === Icons.iconEyeClosed) ? Icons.iconEyeOpen : Icons.iconEyeClosed;
  }

}
