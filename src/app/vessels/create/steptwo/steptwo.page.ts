import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { VesselsDataService } from '../../data/vessels-data.service';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { pageEventNames } from 'src/app/shared/services/analytics/event-names';
import { SyncService } from 'src/app/shared/services/sync/sync.service';

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
  isEditing: boolean = false;

  constructor(
    public sharedMethods: SharedmethodsService,
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
    public vesselDataService: VesselsDataService,
    public modalCtrl: ModalController,
    public router: Router,
    public analytics: AnalyticsService,
    public syncService: SyncService,
  ) {
    super(contentService);
  }

  async getPageParams() {
    this.activatedRoute.params.subscribe((params) => {
      const { data, questions } = params;
      this.prevQuestions = JSON.parse(questions);
      this.prevData = JSON.parse(data);
    });
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.isEditing = queryParams.isEditing === 'true';
    });
  }

  async ngOnInit() {
    super.ngOnInit();
    await this.getPageParams();
    const pageData = this.contentService.getContentByPropertyName(
      'vessels-createsteptwo'
    );
    this.commonText = this.contentService.commonText;
    this.submitButtonText = this.isEditing ? this.commonText?.update : this.commonText?.save;
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.pageTitle = this.isEditing ? this.pageText?.editVessel : pageData?.pageTitle;
    this.formQuestions = this.prevQuestions.concat(pageData?.formQuestions);
    this.formQuestions.forEach((entry) => {
      if (entry.displayquestion === false) return;
      const validators = this.sharedMethods.getFormValidators(entry);
      if (entry.key in this.prevData) {
        this.group[entry.key] = new FormControl(this.prevData[entry.key], validators);
      } else {
        this.group[entry.key] = new FormControl('', validators);
      }
    });

    this.pageFormGroup = new FormGroup(this.group);
    this.analytics.trackEvent(pageEventNames.createVessel2, this.sharedMethods.analyticsEventParams);
  }

  async onSubmit(formData) {
    this.sharedMethods.showLoader(this.pageText?.savingVessel);
    const now = this.sharedMethods.getCurrentDateTime();
    const userData = await this.sharedMethods.getUserData();
    formData.updated_at = now;
    formData.updated_by = userData.id;
    
    if (!this.isEditing) {
      formData.created_at = formData.updated_at = now;
      formData.created_by = formData.updated_by = userData.id;
      formData.app_ref = this.sharedMethods.generateAppRef();
      
      const insertId = await this.vesselDataService.create(formData);
      
      if (insertId) {
        if (formData?.image_url?.webPath) {
          const imageData = {
            vessel_id: insertId,
            image_url: formData?.image_url?.webPath,
            description: '', // TODO: update description
            app_ref: this.sharedMethods.generateAppRef(),
          };
          const imageInsertId = await this.vesselDataService.createVesselImage(imageData);
          if (!imageInsertId) {
            this.sharedMethods.showLoader(this.pageText?.errSavingImage);
          }
        }

        await this.syncService.syncVessels();
        
        const vesselDetails = {
          ...formData,
          imageFile: formData?.image_url,
          regNo: formData?.reg_no,
        };
        this.modalCtrl.dismiss();
        this.router.navigate(['vessels/view', {vessel: JSON.stringify(vesselDetails)}], { replaceUrl: true });
      } else {
        this.sharedMethods.showLoader(this.pageText?.errCreatingVessel);
      }
    } else {
      formData.app_ref = this.prevData?.app_ref;
      formData.id = parseFloat(this.prevData.id);
      const result = await this.vesselDataService.update(formData);
      if (result?.rowsAffected > 0) {
        let vesselDetails = result?.vessel;
        const vesselImage = await this.vesselDataService.getVesselImageByVesselId(formData.id);
        if (vesselImage) {
          const imageData = {
            id: vesselImage.id,
            vessel_id: formData.id,
            image_url: typeof formData?.image_url === 'string' ? formData?.image_url :
           formData?.image_url?.webPath,
            description: '', // TODO: update description
          };
          const imageResult = await this.vesselDataService.updateVesselImage(imageData);
          if (imageResult?.rowsAffected === 0) {
            this.sharedMethods.showLoader(this.pageText?.errUpdatingImage);
          } else {
            vesselDetails = { ...vesselDetails, imageFile: {webPath: imageResult.image.image_url} };
          }
        } else {
          const imageData = {
            vessel_id: formData.id,
            image_url: typeof formData?.image_url === 'string' ? formData?.image_url :
           formData?.image_url?.webPath,
            description: '', // TODO: update description
            app_ref: this.sharedMethods.generateAppRef(),
          };
          const imageInsertId = await this.vesselDataService.createVesselImage(imageData);
          if (!imageInsertId) {
            this.sharedMethods.showLoader(this.pageText?.errSavingImage);
          } else {
            vesselDetails = { ...vesselDetails, imageFile: {webPath: imageData.image_url} };
          }
        }

        await this.syncService.syncVessels();

        this.modalCtrl.dismiss();
        this.router.navigate(['vessels/view', {vessel: JSON.stringify(vesselDetails)}], { replaceUrl: true });
      } else {
        this.sharedMethods.showLoader(this.pageText?.errUpdatingVessel);
      }
    }
  }
}
