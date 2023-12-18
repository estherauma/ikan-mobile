import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { VesselsDataService } from '../../data/vessels-data.service';

@Component({
  selector: 'app-steptwo',
  templateUrl: './steptwo.page.html',
  styleUrls: ['./steptwo.page.scss'],
})
export class SteptwoPage extends BaseformPage implements OnInit {
  submitButtonText = 'Save';
  prevQuestions: any;
  prevData: any;
  pageText: any;

  constructor(
    public sharedMethods: SharedmethodsService,
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
    public vesselDataService: VesselsDataService,
    public modalCtrl: ModalController,
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
    this.commonText = this.contentService.commonText;
    this.submitButtonText = this.commonText?.save;
    this.pageTitle = pageData?.pageTitle;
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.formQuestions = this.prevQuestions.concat(pageData?.formQuestions);
    this.formQuestions.forEach((entry) => {
      if (entry.key in this.prevData) {
        this.group[entry.key] = new FormControl(this.prevData[entry.key], [Validators.required]);
      } else {
        this.group[entry.key] = new FormControl('', [Validators.required]);
      }

    });

    this.pageFormGroup = new FormGroup(this.group);
  }

  async onSubmit(formData) {
    this.sharedMethods.showLoader(this.pageText?.savingVessel);
    const now = this.sharedMethods.getCurrentDateTime();
    formData.created_at = formData.updated_at = now;
    const userData = await this.sharedMethods.getUserData();
    formData.created_by = formData.updated_by = userData.id;
    formData.app_ref = this.sharedMethods.generateAppRef();
    const insertId = await this.vesselDataService.create(formData);
    
    if (insertId) {
      const imageData = {
        vessel_id: insertId,
        image_url: formData?.image_url,
        description: '', // TODO: update description
      };
      const imageInsertId = await this.vesselDataService.createVesselImage(imageData);
      if (!imageInsertId) {
        this.sharedMethods.showLoader(this.pageText?.errSavingImage);
      }
      this.modalCtrl.dismiss();
      this.router.navigate(['vessels/view', formData], { replaceUrl: true });
    } else {

      this.sharedMethods.showLoader(this.pageText?.errCreatingVessel);
    }
  }
}
