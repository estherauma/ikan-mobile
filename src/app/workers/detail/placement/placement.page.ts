import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-placement',
  templateUrl: './placement.page.html',
  styleUrls: ['./placement.page.scss'],
})
export class PlacementPage implements OnInit {
  commonText: any;
  wo = {
    name: 'Work order 2',
    internalRef: 'IJSWERWXDWER',
    dateOpened: '2022-10-15',
    status: 'Close',
    appRef: 'XXX-XXX-XXX',
  };

  placementAgreement = {
    name: 'Placement_Agreement.pdf',
    info: 'More info. Functionality here is click panel to view.',
  };

  employmentAgreement = {
    name: 'Employment Agreement.pdf',
    info: 'More info. Functionality here is click panel to view.',
  };

  orderAndServiceAgreement = [
    {
      name: 'Job Order.pdf',
      info: 'More info. Functionality here is click panel to view.',
    },
    {
      name: 'Service Agreement.pdf',
      info: 'More info. Functionality here is click panel to view.',
    },
  ];

  constructor(
    public contentService: ContentService,
  ) {}

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
  }

  viewDetails(wo) {}
}
