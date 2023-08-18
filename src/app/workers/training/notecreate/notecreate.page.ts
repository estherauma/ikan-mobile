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
})
export class NotecreatePage extends BaseformPage implements OnInit {
  submitButtonText = 'Save';
  constructor(
    public contentService: ContentService,
    public modalCtrl: ModalController,
    public sharedMethods: SharedmethodsService,
  ) {
    super(contentService);
    const deductionsData = this.contentService.getContentByPropertyName('createaudionote');
    this.formQuestions = deductionsData?.formQuestions;
    this.formQuestions.forEach((q) => {
      this.group[q.key] = new FormControl('', [Validators.required]);
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
