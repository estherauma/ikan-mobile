import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-method',
  templateUrl: './login-method.page.html',
  styleUrls: ['./login-method.page.scss'],
})
export class LoginMethodPage implements OnInit {
  pageTitle = "Login Method"
  
  constructor(
    public router: Router,
  ) { }

  ngOnInit() {
  }

  toInviteCodeScreen(){
    this.router.navigate(['auth/invite-code'])
  }

  loginWithUsername(){
    this.router.navigate(["auth/username-login"])
  }

}
