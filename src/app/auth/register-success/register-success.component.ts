import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-register-success',
  templateUrl: './register-success.component.html',
  styleUrls: ['./register-success.component.scss'],
})
export class RegisterSuccessComponent  implements OnInit {
  pageText: any;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
  ) { }

  ngOnInit() {
    const pageData = this.contentService.getContentByPropertyName('signup-sucess');
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
  }

}
