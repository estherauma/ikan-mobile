import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedmethodsService } from '../services/sharedmethods/sharedmethods.service';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';

@Component({
  selector: 'app-dashboardelcomesection',
  templateUrl: './dashboardelcomesection.component.html',
  styleUrls: ['./dashboardelcomesection.component.scss'],
})
export class DashboardelcomesectionComponent implements OnInit {

  @Input() name: string;
  @Input() greeting: string;
  @Input() profileImageUrl: string = '';

  @Output() onProfileClick = new EventEmitter<any>();

  constructor(
    public sharedMethods: SharedmethodsService,
    public profileDataService: ProfilesDataService,
  ) {}

  async ngOnInit() {
    const user = await this.sharedMethods.getUserData();
    const userProfile = await this.profileDataService.getSingleProfile(user?.email);
    if (userProfile?.profile_image) {
      this.profileImageUrl = userProfile?.profile_image;
    }
  }

  onIconClick() {
    this.onProfileClick.emit();
  }

}
