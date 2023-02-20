import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  title = 'Pengetahuan';

  lhs = [
    {
      title: 'Sebelum kamu pergi',
      text: 'Perlakuan tidak manusiawi, transshipment, illegal fishing.',
      progressBarValue: '60',
      progressBarType: 'primary',
      progressBarText: 'primary',
      imageUrl: '/assets/icon/image_placeholder.svg'
    },
    {
      title: 'Sebelum kamu pergi',
      text :'Perlakuan tidak manusiawi, transshipment, illegal fishing.',
      progressBarValue :'60',
      progressBarType : 'warning',
      progressBarText: 'warning',
      imageUrl : '/assets/icon/image_placeholder.svg'
    },
    {
      title: 'Sebelum kamu pergi',
      text :'Perlakuan tidak manusiawi, transshipment, illegal fishing.',
      progressBarValue :'0',
      progressBarType : 'primary',
      progressBarText: 'primary',
      imageUrl : '/assets/icon/image_placeholder.svg'
    }
  ];
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  onClick() {
    this.router.navigate(['learninghub/variant']);
  }


}
