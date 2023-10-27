import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../../shared/services/content/content.service';
import { ModalController } from '@ionic/angular';
import { CreateclausePage } from '../clauses/createclause/createclause.page';
import { ContractDataService } from '../data/contract-data.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  commonText: any;
  pageTitle: string;
  contract;
  contractClauses = [];
  done = false;

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
    public contentService: ContentService,
    public modalController: ModalController,
    public contractDataService: ContractDataService
  ) {}

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.activatedRoute.params.subscribe((params) => {
      this.pageTitle = params.name;
      this.contract = params;
      // TODO: When PARAM is contract id, fetch contract details from the DB
      this.contractDataService.retrieveContractClauses(this.contract.id)
      .then((response) => {
        response.forEach((entry) => {
          // Avoid adding the clause twice.
          // TODO: Add logic to check if clause is included when creating clauses
          const clauseIncluded = this.contractClauses.some((clause) => {
            return clause.title === entry.name;
          });
          if (clauseIncluded) {
            return;
          }
          if (entry.kind === 'contract-clauses-parties-requirement-fishers') {
            // Parties requirement has two entires, so ignore and exit loop
            return;
          } else {
            this.contractClauses.push({
              title: entry.name,
              id: entry.id,
              kind: entry.kind,
              entry: entry
            })
          }
          console.log(entry)
          console.log('********************')
        });
      });
    });
  }

  async createClause() {
    const modal = await this.modalController.create({
      component: CreateclausePage,
      cssClass: 'notification-modal',
      componentProps: {
        contractId: this.contract.id,
      }
    });

    modal.present();

    modal.onDidDismiss().then((data) => {
    });
  }

}
