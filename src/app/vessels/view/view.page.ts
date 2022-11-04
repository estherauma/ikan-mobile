import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  pageTitle = 'Vessel Details';
  vessel: any;

  workOrders = [
    {
      name: 'Work order 1',
      internalRef: 'IWXDWER8234',
      dateOpened: '2022-10-23',
      status: 'Open',
      appRef: 'XXX-XXX-XXX',
    }
];
  constructor(
    public activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit() {
    await this.getParams();
  }

  getParams() {
    this.activatedRoute.params.subscribe((params) => {
      this.vessel = params;
    });
  }

}
