import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  onCreateVisa() {
    this.router.navigate(['/mydocuments/createpassport']);
  }

  onGoToEssentials() {
    this.router.navigate(['mydocuments/home']);
  }

  onGoToFiles() {
    this.router.navigate(['mydocuments/files']);
  }

  onViewDocument(url) {
    console.log(url);
    this.router.navigate(['mydocuments/details']);
  }

}
