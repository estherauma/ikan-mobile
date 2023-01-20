import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invite-code',
  templateUrl: './invite-code.page.html',
  styleUrls: ['./invite-code.page.scss'],
})
export class InviteCodePage implements OnInit {

  pageTitle = 'Invite Code';

  constructor(
    public router: Router
    ) { }

  ngOnInit() {
  }

  onLogin() {
    this.router.navigate(['/intro']);
  }

  onSubmit() {

  }

  inputValue(data) {
  }

}
