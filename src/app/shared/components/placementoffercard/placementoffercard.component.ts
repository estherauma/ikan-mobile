import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    selector: 'app-placementoffercard',
    templateUrl: './placementoffercard.component.html',
    styleUrls: ['./placementoffercard.component.scss'],
    standalone: false
})
export class PlacementoffercardComponent implements OnInit {
  @Input() clauseId = '';
  @Input() clauseKind = '';
  @Input() clause: any;
  @Input() title = '';
  @Input() details = '';
  @Input() isFirst = false;
  @Input() isLast = false;
  @Input() noMargin = false;
  @Input() isBlue = false;
  @Input() partyB = '';
  @Input() contract: any;

  constructor(
    public router: Router
  ) { }

  ngOnInit() {}

  viewClauseDetails() {
    this.clause.partyB = this.partyB;
    const data = {
      ...this.clause,
      partyB: this.partyB,
      contractId: this.contract.id,
      contractOnlineRef: this.contract.onlineRef,
    };
    this.router.navigate(['/contracts/clauses/viewclause/', data]);
  }
}
