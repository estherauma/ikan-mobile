import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-register-success',
  templateUrl: './register-success.component.html',
  styleUrls: ['./register-success.component.scss'],
})
export class RegisterSuccessComponent  implements OnInit {
  commonText: any;
  title: string = '';

  constructor(
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.title = this.commonText?.registrationSuccess;
  }

}
