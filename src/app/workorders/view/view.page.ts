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
      img: '',
      title: 'Parties requirement',
      description: '<i>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur</i>'
    },
    {
      img: '',
      title: 'Place of work',
      description: '<p>Neque porro quisquam est qui dolorem</p> <b>ipsum quia dolor sit amet, consectetur</b>'
    },
    {
      img: '',
      title: 'Provisions',
      description: `<img src="https://source.unsplash.com/random" alt="A random image from Unsplash"/>
      Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur`
    },
    {
      img: '',
      title: 'Wages',
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    },
    {
      img: '',
      title: 'Notice of Termination of Agreement',
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    },
    {
      img: '',
      title: 'Protection',
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    },
    {
      img: '',
      title: 'Parties requirement',
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    },
    {
      img: '',
      title: 'Parties requirement',
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    },
    {
      img: '',
      title: 'Expenses',
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    },
    {
      img: '',
      title: 'Additional particulars required to be include by United Kingdom Law',
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    },
    {
      img: '',
      title: 'Signature',
      description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur'
    }
  ];

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

}
