import { Component, OnInit } from '@angular/core';
import { ContentService } from '../shared/services/content/content.service';
import { AnalyticsService } from '../shared/services/analytics/analytics.service';
import { SharedmethodsService } from '../shared/services/sharedmethods/sharedmethods.service';

@Component({
    selector: 'app-get-help',
    templateUrl: './get-help.component.html',
    styleUrls: ['./get-help.component.scss'],
    standalone: false
})
export class GetHelpComponent  implements OnInit {
  commonText: any;
  allContent: any;
  pageContent: any = [];

  constructor(
    public contentService: ContentService,
    public analytics: AnalyticsService,
    public sharedMethods: SharedmethodsService
  ) { }

  ngOnInit() {
    this.allContent = this.contentService.getContentByPropertyName('get-help');
    this.pageContent = this.allContent?.pageContent;
    this.addSectionSeparator();
    
    this.analytics.trackEvent('viewGetHelp', this.sharedMethods.analyticsEventParams);
  }

  ionViewDidEnter() {
    this.changeDropDownIcons();
  }

  addSectionSeparator() {
    this.pageContent = this.pageContent.map((section: any, index: number) => {
      if (
        ((section?.type === 'text_area' && section?.description) || (section?.type !== 'text_area')) &&
        index !== this.pageContent.length - 1
      ) {
        return { ...section, hasSeparator: true };
      }
      return section;
    });
  }

  changeDropDownIcons() {
    const allButtonItems = document.querySelectorAll('ion-item[button]');

    allButtonItems.forEach((item: any) => {
      item.detailIcon = 'caret-forward-outline';
    });
  }
}
