import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BadgeinfoPage } from '../badgeinfo/badgeinfo.page';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.page.html',
  styleUrls: ['./badges.page.scss'],
})
export class BadgesPage implements OnInit {
  badges = [
    {
      name: 'Badge name',
      date: 'xx/xx/xxxx',
      completed: true
    },
    {
      name: 'Badge name',
      date: 'xx/xx/xxxx',
      completed: false
    },
    {
      name: 'Badge name',
      date: 'xx/xx/xxxx',
      completed: true
    },
    {
      name: 'Badge name',
      date: 'xx/xx/xxxx',
      completed: false
    },
    {
      name: 'Badge name',
      date: 'xx/xx/xxxx',
      completed: true
    },
    {
      name: 'Badge name',
      date: 'xx/xx/xxxx',
      completed: true
    },
    {
      name: 'Badge name',
      date: 'xx/xx/xxxx',
      completed: true
    },
    {
      name: 'Badge name',
      date: 'xx/xx/xxxx',
      completed: false
    },
    {
      name: 'Badge name',
      date: 'xx/xx/xxxx',
      completed: true
    },
    {
      name: 'Badge name',
      date: 'xx/xx/xxxx',
      completed: false
    },
    {
      name: 'Badge name',
      date: 'xx/xx/xxxx',
      completed: true
    },
    {
      name: 'Badge name',
      date: 'xx/xx/xxxx',
      completed: true
    },
  ];
  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  async onDetails(completed) {
    const modal = await this.modalCtrl.create({
      component: BadgeinfoPage,
      componentProps: {
        completed
      },
      cssClass: 'tuna-modal'
    });

    modal.present();
    modal.onDidDismiss().then((data) => {
      // TODO: handle action from badge info
    });
  }

}
