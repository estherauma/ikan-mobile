import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../../shared/services/content/content.service';
import { ModalController } from '@ionic/angular';
import { CreateclausePage } from '../clauses/createclause/createclause.page';
import { ContractDataService } from '../data/contract-data.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

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
  partiesRequirementId: string;
  createButtonText: string = 'Add new clause';
  pageText: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public contentService: ContentService,
    public modalController: ModalController,
    public contractDataService: ContractDataService,
    public sharedMethods: SharedmethodsService
  ) {}

  ngOnInit() {
    // TODO: Consider refactoring this method to smaller functions
    this.commonText = this.contentService?.commonText;
    this.activatedRoute.params.subscribe((params) => {
      this.contract = params;
      if (params.name === 'undefined' || params.name === undefined) {
        this.contract = this.contractDataService.getSingleContract(params.id);
      }
      this.pageTitle = params.name;
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
            this.partiesRequirementId = entry.id;
            return;
          } else {
            this.contractClauses.push({
              title: entry.name,
              id: entry.id,
              kind: entry.kind,
              entry: entry,
              data: entry.content
            })
          }
        });
      });
    });
    this.pageSetup();
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

  pageSetup() {
    const pageData = this.contentService.getContentByPropertyName('contracts-view-clause');
    if (!pageData) {
        return;
    }
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.createButtonText = this.pageText?.addNewCaluse
  }

}
