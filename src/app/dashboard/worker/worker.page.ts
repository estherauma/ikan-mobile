import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { PushNotificationsService } from 'src/app/shared/services/push-notifications/push-notifications.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { UserData, StorageKeys } from 'src/app/shared/types/api-types';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.page.html',
  styleUrls: ['./worker.page.scss'],
})
export class WorkerPage implements OnInit {
  commonText: any;
  user: UserData;
  name: string = '';

  sLists = [
    {title: 'Contracts', icon: '/assets/icon/offers.svg',  url: '/contracts/home'},
    // {title: 'Placement'},
    // {title: 'My Document'},
    // {title: 'To Do'},
    // {title: 'Training'},
    // {title: 'Payments'},
  ];

  constructor(
    public pushNotifications: PushNotificationsService,
    public contentService: ContentService,
    public sharedmethods: SharedmethodsService,
    public router: Router,
  ) {
    this.contentService.watchContent().subscribe(async(resp) => {
      if (resp) {
        this.commonText = this.contentService.commonText;
        await this.setupPage();
      }
    });
  }

  ngOnInit() {
    if (!this.pushNotifications.preventSecondNotificationPrompt) {
      this.pushNotifications.checkAndroidPNsPermissions();
    }
    this.setupPage();
  }

  async setupPage() {
    this.commonText = this.contentService.commonText;
    this.user = await this.sharedmethods.readDataFromStorage(StorageKeys.userData);
    this.name = this.commonText?.hi || '' + ' ' + this.user?.firstName || '';
    await this.contentService.updateCurrentLanguage();
    const menuContent = await this.contentService.getMenuContent();

      // for item in slists, update title with menuContent
      this.sLists.forEach((item) => {
        Object.entries(menuContent).forEach((x) => {
          if (x[1]['url'] === item.url) {
            item['title'] = x[1]['label'];
          }
        });
      });
  }

  goToWorkerProfile() {
    this.router.navigate(['/worker/profile']);
  }
}
