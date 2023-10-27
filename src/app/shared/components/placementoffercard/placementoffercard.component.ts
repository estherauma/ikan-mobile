import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-placementoffercard',
  templateUrl: './placementoffercard.component.html',
  styleUrls: ['./placementoffercard.component.scss'],
})
export class PlacementoffercardComponent implements OnInit {
  @Input() clauseId = '';
  @Input() clauseKind = '';
  @Input() title = '';
  @Input() details = '';
  @Input() isFirst = false;
  @Input() isLast = false;
  @Input() noMargin = false;
  @Input() isBlue = false;

  constructor(
    public router: Router
  ) { }

  ngOnInit() {}

  viewClauseDetails() {
    console.log(this.clauseKind)
    console.log(this.clauseId)
    console.log('view clause details')
    this.router.navigate(['/contracts/clauses/viewclause/', {clauseId: this.clauseId, clauseKind: this.clauseKind}])
  }
}
