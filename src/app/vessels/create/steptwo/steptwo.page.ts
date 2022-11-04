import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
      label: 'Option One',
    },
    {
      name: 'Option Two',
      value: 'Option Two',
      label: 'Option Two',
    },
  ];
  submitButtonText = 'Save';
  prevQuestions: any;
  prevData: any;

  constructor(
    public sharedMethods: SharedmethodsService,
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    super(contentService);
  }

  async getPageParams() {
    this.activatedRoute.params.subscribe((params) => {
      const { data, questions } = params;
      this.prevQuestions = JSON.parse(questions);
      this.prevData = JSON.parse(data);
    });
  }

  async ngOnInit() {
    super.ngOnInit();
    await this.getPageParams();
    const pageData = this.contentService.getContentByPropertyName(
      'vessels-createsteptwo'
    );
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions = this.prevQuestions.concat(pageData?.formQuestions);
    this.formQuestions.forEach((entry) => {
      //TODO: Add dynamic options from prismic
      if (entry.questionType === 'select') {
        entry.options = this.tempOptions;
      }
      if (entry.key in this.prevData) {
        this.group[entry.key] = new FormControl(this.prevData[entry.key], [Validators.required]);
      } else {
        this.group[entry.key] = new FormControl('', [Validators.required]);
      }

    });

    this.pageFormGroup = new FormGroup(this.group);
  }

  onSubmit(formData) {
    this.router.navigate(['vessels/view', formData]);
  }
}
