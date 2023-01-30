import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workordercard',
  templateUrl: './workordercard.component.html',
  styleUrls: ['./workordercard.component.scss'],
})
export class WorkordercardComponent implements OnInit {
  @Input() wo;
  constructor( private router: Router) { }

  ngOnInit() {}

  onClick(wo) {
    this.router.navigate(['/workorders/view', wo]);
  }

}
