import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { FieldType, IPasswordResetResp, Icons } from 'src/app/shared/types/api-types';

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
      const pageData = this.contentService.getContentByPropertyName('accesstoken');
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
    this.sharedMethods.showLoader(this.commonText?.loadingText);
    if (data?.password?.trim() !== data?.passwordConfirm?.trim()) {
      this.sharedMethods.showToast(this.commonText?.passwordsDoNotMatch);
      this.fieldErrors = {passwordConfirm: this.commonText?.passwordsDoNotMatch};
      this.sharedMethods.hideLoader();
      return;
    }
    this.apiService.post('accounts/verify-access-token', data)
    .subscribe(
      (res: IPasswordResetResp) => {
        if (res?.status == 'OK') {
          this.sharedMethods.showToast(res?.message);
          this.sharedMethods.hideLoader();
          this.router.navigate(['/login']);
          return;
        }

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
