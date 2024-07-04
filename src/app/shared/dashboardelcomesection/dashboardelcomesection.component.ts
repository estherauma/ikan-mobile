import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedmethodsService } from '../services/sharedmethods/sharedmethods.service';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';

@Component({
  selector: 'app-dashboardelcomesection',
  templateUrl: './dashboardelcomesection.component.html',
  styleUrls: ['./dashboardelcomesection.component.scss'],
})
export class DashboardelcomesectionComponent implements OnInit {
  userProfile: any;

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
    this.profileDataService.getAll().subscribe((data) => {
      this.userProfile = data.find((profile) => profile.email === user?.email);
      if (this.userProfile?.profileImage) {
        this.profileImageUrl = this.userProfile?.profileImage;
      }
    });
    
  }

  onIconClick() {
    this.onProfileClick.emit();
  }

}
