import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pageTitle = 'Work Orders';


  constructor(public menuCtrl: MenuController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

}
