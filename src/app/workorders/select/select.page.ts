import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-select',
    templateUrl: './select.page.html',
    styleUrls: ['./select.page.scss'],
    standalone: false
})
export class SelectPage implements OnInit {

  pageTitle = 'Select Work Orders';

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
  ];

  demandLetter: any;
  selectedWorkOrders = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
      this.demandLetter = JSON.parse(this.activatedRoute.snapshot.paramMap.get('demandLetter'));
  }

  selectedWorkOrder(e) {
    if (e.detail.checked) {
        this.selectedWorkOrders.push(e.detail.value);
    } else {
      this.selectedWorkOrders = this.selectedWorkOrders.filter( item => item.internalRef !== e.detail.value.internalRef);
    }
  }

  onConfirm() {
    this.router.navigate(['/demandletters/view', { demandLetter: JSON.stringify({
      ...this.demandLetter,
      workOrders: this.selectedWorkOrders
    }) }]);
  }

  showConfirmBtn() {
    return this.selectedWorkOrders.length > 0;
  }

}
