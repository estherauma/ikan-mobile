import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  pageTitle = 'View Work Order';
  workOrder: any;
  clauses = [
    {
      id: 1,
      img: '',
      title: 'Parties requirement',
      description: '<i>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur</i>',
      status: 'active',
      subTitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    },
    {
      id: 2,
      img: '',
      title: 'Place of work',
      description: '<p>Neque porro quisquam est qui dolorem</p> <b>ipsum quia dolor sit amet, consectetur</b>',
      status: 'active',
      subTitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    },
    {
      id: 3,
      img: '',
      title: 'Provisions',
      description: `<img src="https://source.unsplash.com/random" alt="A random image from Unsplash"/>
      Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur`,
      status: 'active',
      subTitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    },
    {
      id: 4,
      img: '',
      title: 'Wages',
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur',
      status: 'inactive',
      subTitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    },
    {
      id: 5,
      img: '',
      title: 'Notice of Termination of Agreement',
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur',
      status: 'inactive',
      subTitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    },
    {
      id: 6,
      img: '',
      title: 'Protection',
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur',
      status: 'active',
      subTitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    },
    {
      id: 7,
      img: '',
      title: 'Parties requirement',
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur',
      status: 'inactive',
      subTitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    },
    {
      id: 8,
      img: '',
      title: 'Parties requirement',
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur',
      status: 'active',
      subTitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    },
    {
      id: 9,
      img: '',
      title: 'Expenses',
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur',
      status: 'active',
      subTitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    },
    {
      id: 10,
      img: '',
      title: 'Additional particulars required to be include by United Kingdom Law',
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur',
      status: 'inactive',
      subTitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    },
    {
      id: 11,
      img: '',
      title: 'Signature',
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur',
      status: 'active',
      subTitle: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    }
  ];

  done = false;
  onDisabled = false;

  constructor(public router: Router,
    public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.workOrder = params;
      this.pageTitle = `View ${this.workOrder.name}`;
    });
  }

  goToClauses(clause) {
    const objectParams = { ...clause };
    this.router.navigate(['/workorders/clauses'], { queryParams: objectParams });
  }

  onSubWorkOrder() {
    this.router.navigate(['/workorders/send/signatureview']);
  }

  getFirstClause() {
    return this.clauses[0];
  }

  getLastClause() {
    return this.clauses[this.clauses.length - 1];
  }

  addNewClause() {
    this.done = true;
  }

  onCheckBoxSelect(e) {
    this.onDisabled = !this.onDisabled;
  }

}
