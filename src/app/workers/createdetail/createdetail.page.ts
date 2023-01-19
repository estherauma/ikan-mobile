import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-create',
  templateUrl: './createdetail.page.html',
  styleUrls: ['./createdetail.page.scss'],
})
export class CreateDetailPage extends BaseformPage implements OnInit {

  submitButtonText='Save&Close';
  createWorkerFormGroup;
  constructor(
    public contentService: ContentService,
  ) {
    super(contentService);
    const profileFormData = this.contentService.getContentByPropertyName('createworkers');
    this.formQuestions = profileFormData.formQuestions;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.createWorkerFormGroup = new FormGroup(this.group);
   }

  ngOnInit() {
  }

  onSubmit(data) {}

}
