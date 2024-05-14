import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { CreatePage } from '../create/create.page';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  pageTitle: string;
  company;
  commonText: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public contentService: ContentService,
    public modalCtrl: ModalController,
    public sharedMethods: SharedmethodsService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService.commonText;
    this.activatedRoute.params.subscribe((params) => {
      this.company = params;
      this.pageTitle = params.name;
    });
  }

  async editCompany(data){
    let company = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key];
        company[this.sharedMethods.convertCamelToSnakeCase(key)] = element;
      }
    }
    
    const modal = await this.modalCtrl.create({
      cssClass: 'notification-modal',
      component: CreatePage,
      componentProps: {
        company,
        isEditing: true
      }
    });
    modal.present();
    modal.onDidDismiss().then((data) => {
      if (data?.data?.company &&  Object.keys(data.data.company)?.length) {
        this.company = data.data.company;
      }
    });
  }
}
