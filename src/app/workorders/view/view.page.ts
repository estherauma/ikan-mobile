import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { CreateTitlePage } from '../clauses/create-title/create-title.page';
import { WorkordersDataService } from '../data/workorders-data.service';

@Component({
    selector: 'app-view',
    templateUrl: './view.page.html',
    styleUrls: ['./view.page.scss'],
    standalone: false
})
export class ViewPage implements OnInit {
  pageTitle = 'View Work Order';
  workOrder: any;
  clauses = [];

  done = false;
  onDisabled = false;

  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    public sharedMethods: SharedmethodsService,
    public workOrderService: WorkordersDataService,
    public activatedRoute: ActivatedRoute) {

    }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.workOrder = params;
      this.workOrderService.getWorkOrderClauses(params.id).then((data) => {
        data.forEach((entry) => {
        const clause = {
          id: entry.id,
          img: '',
          title: entry.name,
          subTitle: entry.explainerText,
          status: 'active',
        };
        this.clauses.push(clause);
        });
      });
      this.pageTitle = `View ${this.workOrder.name}`;
    });
  }

  goToClauses(clause) {
    const objectParams = { ...clause };
    this.router.navigate(['/workorders/clauses'], { queryParams: objectParams });
  }

  onSubWorkOrder() {
    this.router.navigate(['/workorders/send/signatureview']);
  }

  getFirstClause() {
    return this.clauses[0];
  }

  getLastClause() {
    return this.clauses[this.clauses.length - 1];
  }

  async addNewClause() {
    const modal = await this.modalCtrl.create({
      component: CreateTitlePage,
      cssClass: 'tuna-modal',
      componentProps: {
        workOrderId: this.workOrder.id
      }
    });
    modal.present();
  }

  onCheckBoxSelect(e) {
    this.onDisabled = !this.onDisabled;
  }

}
