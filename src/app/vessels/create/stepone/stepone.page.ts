import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-stepone',
  templateUrl: './stepone.page.html',
  styleUrls: ['./stepone.page.scss'],
})
export class SteponePage extends BaseformPage implements OnInit {

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public modalCtrl: ModalController,
    public router: Router
  ) {
    super(contentService);
    const pageData = this.contentService.getContentByPropertyName('vessels-createstepone');
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  ngOnInit() {
  }

  async onSubmit(formData) {
    this.modalCtrl.dismiss();
    this.router.navigate(['vessels/create/steptwo'], formData );
  }
}
