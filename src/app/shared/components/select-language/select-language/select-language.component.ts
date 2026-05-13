import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys } from 'src/app/shared/types/api-types';

@Component({
    selector: 'app-select-language',
    templateUrl: './select-language.component.html',
    styleUrls: ['./select-language.component.scss'],
    standalone: false
})
export class SelectLanguageComponent  implements OnInit {
  availableLanguages: any = [];
  commonText: any;
  selectedLanguage: string;
  isLanguageSelected = false;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public modalController: ModalController,
  ) {
    this.getAvailableLanguages();
  }

  ngOnInit() {}

  getAvailableLanguages() {
    const data = this.contentService.getAvailableLanguages();
    this.availableLanguages = data?.languages || [];
  }


  async onLanguageSelect(e) {
    this.selectedLanguage = e?.detail?.value;
    this.isLanguageSelected = true;
  }

  async onSubmit() {
    await this.sharedMethods.saveDataToStorage(StorageKeys.currentLanguage, this.selectedLanguage);
    await this.contentService.updateCurrentLanguage();
    this.contentService.contentObs.next(true);
    
    const pageData = await this.contentService.getContentByPropertyName('login-method');
    const loginMethodData = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    const commonText = await this.contentService.commonText;
    await this.modalController.dismiss({
      loginMethodData,
      commonText
    });
  }
}
