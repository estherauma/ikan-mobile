import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-placement',
  templateUrl: './placement.page.html',
  styleUrls: ['./placement.page.scss'],
})
export class PlacementPage extends BaseformPage implements OnInit {
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

  submitButtonText = 'Confirm';

  constructor(
    public contentService: ContentService,
  ) {
    super(contentService);
    const pageData = this.contentService.getContentByPropertyName('tododeparture');
    this.pageTitle = pageData?.pageTitle;
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
    });
    this.pageFormGroup = new FormGroup(this.group);
   }

  ngOnInit() {
  }

  onSubmit(data){}

}
