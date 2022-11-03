import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-steptwo',
  templateUrl: './steptwo.page.html',
  styleUrls: ['./steptwo.page.scss'],
})
export class SteptwoPage extends BaseformPage implements OnInit {
  tempOptions = [
    {
      name: 'Option One',
      value: 'Option One',
      label: 'Option One'
    },
    {
      name: 'Option Two',
      value: 'Option Two',
      label: 'Option Two'
    }
  ];
  submitButtonText = 'Save';

  constructor(
    public sharedMethods: SharedmethodsService,
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute
  ) {
    super(contentService);
    this.activatedRoute.params.subscribe((data) => {
      console.log(data);
    });

    const pageData = this.contentService.getContentByPropertyName('vessels-createsteptwo');
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      //TODO: Add dynamic options from prismic
      if (entry.questionType === 'select') {
        entry.options = this.tempOptions;
      }
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });

    this.pageFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {
  }

  onSubmit(formData) {
    console.log(formData);
  }

}
