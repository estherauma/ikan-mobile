import { Component, Input, OnInit } from '@angular/core';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
    selector: 'app-archived-wo',
    templateUrl: './archived-wo.page.html',
    styleUrls: ['./archived-wo.page.scss'],
    standalone: false
})
export class ArchivedWoPage implements OnInit {
  @Input() vessel: any;
  @Input() workOrders: any;

  pageTitle = 'Archived Work Orders';

  constructor(
    public sharedMethods: SharedmethodsService
  ) { }

  async ngOnInit() {}



}
