import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-invite-code',
  templateUrl: './invite-code.page.html',
  styleUrls: ['./invite-code.page.scss'],
})
export class InviteCodePage extends BaseformPage implements OnInit {

  pageTitle = 'Invite Code';

  constructor(
    public router: Router,
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService
    ) {
      super(contentService);
    
      // const pageData = this.contentService.getContentByPropertyName('accesstoken');
      const pageData = {
        "page_name": "accesstoken",
        "pageTitle": "Access Token",
        "last_updated": "2023-09-12T09:36:21+0000",
        "formQuestions": [
          {
            "key": "accessCode",
            "label": "Access token",
            "options": [],
            "help_text": null,
            "placeholder": null,
            "question_type": "textBox",
            "displayquestion": true
          },
          {
            "key": "password",
            "label": "Password",
            "options": [],
            "help_text": null,
            "placeholder": null,
            "question_type": "password",
            "displayquestion": true
          },
          {
            "key": "passwordConfirm",
            "label": "Confirm your password",
            "options": [],
            "help_text": null,
            "placeholder": null,
            "question_type": "password",
            "displayquestion": true
          }
        ],
        "additionalText": [
          {
            "type": "paragraph",
            "label": "coffeee",
            "value": "Coffee is <strong>good</strong> for you"
          },
          {
            "type": "paragraph",
            "label": "submitButtonText",
            "value": "Go"
          },
          {
            "type": "heading1",
            "label": "sampleHeading",
            "value": "We shall see"
          },
          {
            "type": "unorderedList",
            "label": "Ordered List",
            "value": [
              "asdfasds",
              "sdfsd",
              "asdfasdfasdf"
            ]
          },
          {
            "type": "paragraph",
            "label": "submitButtonText",
            "value": "Go"
          }
        ]
      };
      
      this.pageTitle = pageData?.pageTitle;
      this.pageCommonText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
      this.submitButtonText = this.pageCommonText?.submitButtonText;
      this.formQuestions = pageData?.formQuestions;
      this.formQuestions.forEach((entry) => {
        this.group[entry.key] = new FormControl('', [Validators.required]);
      });
      this.pageFormGroup = new FormGroup(this.group);
      
     }

  ngOnInit() {
  }

  onLogin() {
    this.router.navigate(['/intro']);
  }

  onSubmit(formData) {

  }

  inputValue(data) {
  }

}
