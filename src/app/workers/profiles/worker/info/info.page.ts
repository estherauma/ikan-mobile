import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage extends BaseformPage implements OnInit {
  submitButtonText = 'Save';

  constructor(
    public contentService: ContentService
  ) {
    super(contentService);
    const pageData = this.contentService.getContentByPropertyName('workerbudiinfo');
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions?.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {
    this.commonText = this.contentService.commonText;
    this.submitButtonText = this.commonText?.save;
  }

  onSubmit(data) {}
}
