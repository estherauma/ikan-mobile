import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BadgeinfoPage } from '../badgeinfo/badgeinfo.page';

@Component({
    selector: 'app-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss'],
    standalone: false
})
export class ListPage implements OnInit {
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
  ];
  constructor(
    public router: Router,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  createTodo() {
    this.router.navigate(['/todo/create']);
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
