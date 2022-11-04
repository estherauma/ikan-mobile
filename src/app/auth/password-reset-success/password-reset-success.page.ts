import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset-success',
  templateUrl: './password-reset-success.page.html',
  styleUrls: ['./password-reset-success.page.scss'],
})
export class PasswordResetSuccessPage implements OnInit {
  title = "New password sent"
  description = "feugiat id volutpat eu, laoreet ac orci. Phasellus sodales feugiat luctus. Sed hendrerit neque ut ante imperdiet"
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  toLogin(){
    this.router.navigate(["login"])
  }

}
