import { Component, Input, OnInit } from '@angular/core';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-archived-wo',
  templateUrl: './archived-wo.page.html',
  styleUrls: ['./archived-wo.page.scss'],
})
export class ArchivedWoPage implements OnInit {
  @Input() vessel: any;
  @Input() workOrders: any;

  pageTitle = 'Vessel Work Orders';

  constructor(
    public sharedMethods: SharedmethodsService
  ) { }

  async ngOnInit() {
    console.log(this.vessel);
    console.log(this.workOrders);
  }



}
