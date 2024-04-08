import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys } from 'src/app/shared/types/api-types';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss'],
})
export class SelectLanguageComponent  implements OnInit {
  availableLanguages: any = [];
  languageDataLoading = false;
  currentLanguage = 'en-us'
  commonText: any;

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
    await this.sharedMethods.saveDataToStorage(StorageKeys.currentLanguage, e?.detail?.value);
    await this.contentService.updateCurrentLanguage();
    const pageData = this.contentService.getContentByPropertyName('login-method');
    const loginMethodData = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.modalController?.dismiss({
      loginMethodData
    });
  }

}
