import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { CreatePage } from '../create/create.page';
import { AgentsDataService } from '../data/agents-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pageTitle = 'Manning Agents';
  agents = [];
  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    public agentsDataService: AgentsDataService,
  ) {
    this.agentsDataService.getAll().subscribe((data) => {
      this.agents = data;
    });
  }

  ngOnInit() {
  }

  searchResult(searchResult) {}

  viewDetails(company) {
    this.router.navigate((['agents/details', company]));
  }

  async createAgent() {
    const modal = await this.modalCtrl.create({
      component: CreatePage,
      cssClass: 'notification-modal'
    });
    modal.present();
    modal.onDidDismiss().then((data) => {});
  }

}
