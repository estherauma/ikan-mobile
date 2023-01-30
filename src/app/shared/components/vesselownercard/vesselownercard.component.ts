import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vesselownercard',
  templateUrl: './vesselownercard.component.html',
  styleUrls: ['./vesselownercard.component.scss'],
})
export class VesselownercardComponent implements OnInit {
  @Input() vessel;
  constructor(
    public router: Router,
  ) { }

  ngOnInit() {}

  viewDetails(vessel) {
    this.router.navigate(['vessels/view', vessel]);
  }
}
