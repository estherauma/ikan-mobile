import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-essentials',
  templateUrl: './essentials.component.html',
  styleUrls: ['./essentials.component.scss'],
})
export class EssentialsComponent  implements OnInit {

  constructor(
    public router: Router,
  ) { }

  ngOnInit() {}

  addPassport() {
    this.router.navigate(['/mydocuments/createpassport']);
  }

  addVisa() {}

  addSeamansBook() {}

  addDocument() {}
}
