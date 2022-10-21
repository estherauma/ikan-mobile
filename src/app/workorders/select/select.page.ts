import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.page.html',
  styleUrls: ['./select.page.scss'],
})
export class SelectPage implements OnInit {

  workOrders = [
    {
      name: 'Work order 1',
      internalRef: 'IWXDWER8234',
      dateOpened: '2022-10-23',
      status: 'Open',
      appRef: 'XXX-XXX-XXX',
    },
    {
      name: 'Work order 2',
      internalRef: 'IJSWERWXDWER',
      dateOpened: '2022-10-15',
      status: 'Open',
      appRef: 'XXX-XXX-XXX'
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
