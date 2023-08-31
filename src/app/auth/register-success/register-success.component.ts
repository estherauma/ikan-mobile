import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-success',
  templateUrl: './register-success.component.html',
  styleUrls: ['./register-success.component.scss'],
})
export class RegisterSuccessComponent  implements OnInit {
  // TODO: localise text
  title: string = 'Registration Success';

  constructor() { }

  ngOnInit() {}

}
