import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-login-method',
  templateUrl: './login-method.page.html',
  styleUrls: ['./login-method.page.scss'],
})
export class LoginMethodPage implements OnInit {
  commonText: any;
  pageTitle = 'Login Method';
  // inviteCodeAuth and usernameAuth initialized with values for the first few seconds before content is fetched from the api
  // TODO: uncomment after testing
  inviteCodeAuth: string // = 'I have an invite code'.toUpperCase();
  usernameAuth: string // = 'Login with username/email'.toUpperCase();
  watchContent: Subscription;

  constructor(
    public router: Router,
    public contentService: ContentService,
    public cdr: ChangeDetectorRef,
  ) {
    this.watchContent = this.contentService.watchContent().subscribe((resp) => {
      if (resp) {
        this.commonText = this.contentService?.commonText;
        this.inviteCodeAuth = this.commonText?.inviteCodeAuth;
        this.usernameAuth = this.commonText?.usernameAuth;
      }
    });
  }

  async ngOnInit() {
    this.commonText = this.contentService?.commonText;
    if (this.commonText) {
      this.inviteCodeAuth = this.commonText?.inviteCodeAuth;
      this.usernameAuth = this.commonText?.usernameAuth;
    };
  }

  toInviteCodeScreen() {
    this.router.navigate(['auth/invite-code']);
  }

  loginWithUsername() {
    this.router.navigate(['login']);
  }

}
