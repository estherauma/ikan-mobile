import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-view-passport',
  templateUrl: './view-passport.component.html',
  styleUrls: ['./view-passport.component.scss'],
})
export class ViewPassportComponent  implements OnInit {
  userPassportDetails;
  passportViewData;
  docsCommonText: any;
  
  constructor(
    public sharedMethods: SharedmethodsService,
    public modalController: ModalController,
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    const docsPageData = this.contentService.getContentByPropertyName('my-documents-common-text');
    this.docsCommonText = this.sharedMethods.convertAdditionalTextToObj(docsPageData?.additionalText);
  }

  closeView() {
    this.modalController.dismiss();
  }

  handleDeleteImage(e) {}
}
