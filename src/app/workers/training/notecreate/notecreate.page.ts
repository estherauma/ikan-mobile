import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
    selector: 'app-notecreate',
    templateUrl: './notecreate.page.html',
    styleUrls: ['./notecreate.page.scss'],
    standalone: false
})
export class NotecreatePage extends BaseformPage implements OnInit {
  submitButtonText = '';
  
  constructor(
    public contentService: ContentService,
    public modalCtrl: ModalController,
    public sharedMethods: SharedmethodsService,
  ) {
    super(contentService);
    this.commonText = this.contentService?.commonText;
    this.submitButtonText = this.commonText?.save;
    const deductionsData = this.contentService.getContentByPropertyName('createaudionote');
    this.formQuestions = deductionsData?.formQuestions;
    this.formQuestions.forEach((q) => {
      const validators = this.sharedMethods.getFormValidators(q);
      this.group[q.key] = new FormControl('', validators);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {
  }

  onSubmit(formData) {
    this.sharedMethods.showLoader(this.commonText?.savingVoiceNote);
    this.modalCtrl.dismiss(formData);
  }
}
