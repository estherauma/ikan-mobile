import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-login-method',
  templateUrl: './login-method.page.html',
  styleUrls: ['./login-method.page.scss'],
})
export class LoginMethodPage implements OnInit {
  pageTitle = 'Login Method';
  inviteCodeAuth: string = '';
  usernameAuth: string = '';

  constructor(
    public router: Router,
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.inviteCodeAuth = this.contentService.commonText?.inviteCodeAuth;
    this.usernameAuth = this.contentService.commonText?.usernameAuth;
  }

  toInviteCodeScreen() {
    this.router.navigate(['auth/invite-code']);
  }

  loginWithUsername() {
    this.router.navigate(['login']);
  }

}
