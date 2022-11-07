import { Component, OnInit } from '@angular/core';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-how-to-signup',
  templateUrl: './how-to-signup.page.html',
  styleUrls: ['./how-to-signup.page.scss'],
})
export class HowToSignupPage implements OnInit {

  pageTitle = "How to sign up"
  title = ""
  description = ""

  constructor(
    public contentService: ContentService,
  ) { 
    const pageData = this.contentService.getContentByPropertyName("howtosignup");
    this.description = pageData?.data[0].value
    this.title = pageData?.pageTitle
  }

  ngOnInit() {
  }

}
