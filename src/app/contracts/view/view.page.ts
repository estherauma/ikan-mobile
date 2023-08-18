import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../../shared/services/content/content.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  commonText: any;
  pageTitle: string;
  contract;

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
    public activatedRoute: ActivatedRoute,
    public contentService: ContentService
  ) {}

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.activatedRoute.params.subscribe((params) => {
      this.pageTitle = params.name;
      this.contract = params;
    });
  }

  viewDetails(wo) {}
}
