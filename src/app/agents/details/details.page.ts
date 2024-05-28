import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { pageEventNames } from 'src/app/shared/services/analytics/event-names';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  agent: any;


  constructor(
    public activatedRoute: ActivatedRoute,
    public sharedMethods: SharedmethodsService,
    public analytics: AnalyticsService
  ) { }

  async ngOnInit() {
    await this.getParams();
    this.analytics.trackEvent(pageEventNames.viewAgent, this.sharedMethods.analyticsEventParams);
  }

  getParams() {
    this.activatedRoute.params.subscribe((params) => {
      this.agent = params;
    });
  }

  uploadContract() {}
}
