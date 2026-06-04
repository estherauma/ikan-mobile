import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedmethodsService } from '../services/sharedmethods/sharedmethods.service';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';
import { UserData, UserRole } from '../types/api-types';
import { VesselsDataService } from 'src/app/vessels/data/vessels-data.service';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../services/content/content.service';

@Component({
    selector: 'app-dashboardelcomesection',
    templateUrl: './dashboardelcomesection.component.html',
    styleUrls: ['./dashboardelcomesection.component.scss'],
    standalone: false
})
export class DashboardelcomesectionComponent implements OnInit {

  user: UserData;
  userProfile: any;
  commonText: any;

  @Input() name: string = '';
  @Input() greeting: string = '';
  @Input() profileImageUrl: string = '';
  @Input() workerVessel: any; // Worker's vessel details

  @Output() onProfileClick = new EventEmitter<any>();

  constructor(
    public sharedMethods: SharedmethodsService,
    public profileDataService: ProfilesDataService,
    public vesselsDataService: VesselsDataService,
    public activatedRoute: ActivatedRoute,
    public contentService: ContentService,
  ) {
    this.activatedRoute.params.subscribe(async() => {
      await this.pageSetup();
    });
  }

  async ngOnInit() {
    await this.pageSetup();
  }

  async pageSetup() {
    this.user = await this.sharedMethods.getUserData();
    this.commonText = await this.contentService.commonText;
    this.profileDataService.getAll().subscribe(async(data) => {
      this.userProfile = this.profileDataService.getSingleProfile(this.user?.email, this.user?.mobile);
      if (this.userProfile?.profileImage) {
        this.profileImageUrl = this.userProfile?.profileImage;
      }
    });

    if (this.user?.role === UserRole.worker) {
      this.vesselsDataService.getAll().subscribe(async() => {
        const workerVessel = await this.vesselsDataService.getWorkerVessel();
        if (workerVessel) {
          this.workerVessel = workerVessel;
        }
      });
    }
  }

  onIconClick() {
    this.onProfileClick.emit();
  }

}
