import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.page.html',
  styleUrls: ['./sandbox.page.scss'],
})
export class SandboxPage implements OnInit {
  contracts = [
    {
      imgUrl: 'assets/imgs/vessel.jpeg',
      title: 'Budi Surname',
      contract: 'Taien Company',
      vessel: 'Vessel Name',
      dates: 'XX/XX/XXXX',
      isLight: false,
    },
    {
      imgUrl: 'assets/imgs/vessel.jpeg',
      title: 'Budi Surname',
      contract: 'Taien Company',
      vessel: 'Vessel Name',
      dates: 'XX/XX/XXXX',
      isLight: true,
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
