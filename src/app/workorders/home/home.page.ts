import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { CreatePage } from '../create/create.page';
import { WorkordersDataService } from '../data/workorders-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  select = false;
  //TODO: Use translated text from prismic
  pageTitle = 'Work Orders';
  workOrders = [];

selectText = '';
cancelText = '';

filterOptions = [
  {title:'closed', value:'closed'},
  {title:'opened', value:'opened'}
];



  constructor(
    public menuCtrl: MenuController,
    public router: Router,
    public contentService: ContentService,
    private workOrderService: WorkordersDataService,
    public modalCtrl: ModalController) {
      this.workOrderService.getAll().subscribe((data) => {
        this.workOrders = data;
      });
    }

  ngOnInit() {
    this.cancelText = this.contentService.commonText?.cancel;
    this.selectText = this.contentService.commonText?.select;
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  async createWorkOrder() {
    const modal = await this.modalCtrl.create({
      component: CreatePage,
      cssClass: 'tuna-modal',

    });
    modal.present();

    modal.onDidDismiss().then((data) => {
      // TODO: Form data is here for processing and saving.
    });
  }

  viewDetails(workOrder) {
    this.router.navigate(['/workorders/view', workOrder]);
  }

  searchResult(result) {
  }

  filterResult(result) {}

  onSelect() {
    this.select = true;
  }

  onCancel() {
    this.select = false;
  }
}
