import { Component, OnInit } from '@angular/core';
import { ContentService } from '../shared/services/content/content.service';
import { SharedmethodsService } from '../shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys } from '../shared/types/api-types';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {
  currentLanguage = 'en-us';
  availableLanguages = [];

  constructor(
    public cotentServ: ContentService,
    public sharedMethods: SharedmethodsService
  ) {
    this.getAvailableLanguages();
    this.sharedMethods.readDataFromStorage(StorageKeys.currentLanguage)
    .then((data) => {
      if (data != null) {
        this.currentLanguage = data;
      }
    });
  }

  ngOnInit() {
  }

  getAvailableLanguages() {
    const languages = this.cotentServ.getAvailableLanguages();
    this.availableLanguages = languages;
  }


  changeLanguage(selectedLanguage) {
    this.sharedMethods.saveDataToStorage(StorageKeys.currentLanguage,selectedLanguage?.detail?.value);
  }
}
