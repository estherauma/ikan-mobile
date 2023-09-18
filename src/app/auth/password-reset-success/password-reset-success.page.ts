import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset-success',
  templateUrl: './password-reset-success.page.html',
  styleUrls: ['./password-reset-success.page.scss'],
})
export class PasswordResetSuccessPage implements OnInit {
  title = 'Password reset successfully';
  description = 'Your password has been reset successfully. Click OK to login with your new password.';
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  toLogin() {
    this.router.navigate(['login']);
  }

}
